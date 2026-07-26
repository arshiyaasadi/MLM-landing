from pathlib import Path
import re

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Inches, Pt


SOURCE = Path("REVISED_MIGRAINE_MANUSCRIPT.md")
OUTPUT = Path("REVISED_MIGRAINE_MANUSCRIPT_IPHONE.docx")


def clean_markdown(text: str) -> str:
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = text.replace("**", "").replace("*", "").replace("`", "")
    return text.strip()


def add_text(paragraph, text: str) -> None:
    paragraph.add_run(clean_markdown(text))


document = Document()
section = document.sections[0]
section.top_margin = Inches(0.8)
section.bottom_margin = Inches(0.8)
section.left_margin = Inches(0.85)
section.right_margin = Inches(0.85)

styles = document.styles
normal = styles["Normal"]
normal.font.name = "Times New Roman"
normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")
normal.font.size = Pt(11)
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.15

for style_name, size in (("Title", 17), ("Heading 1", 14), ("Heading 2", 12), ("Heading 3", 11)):
    style = styles[style_name]
    style.font.name = "Arial"
    style._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    style.font.size = Pt(size)
    style.font.bold = True

lines = SOURCE.read_text(encoding="utf-8").splitlines()
paragraph_buffer: list[str] = []


def flush_paragraph() -> None:
    if not paragraph_buffer:
        return
    paragraph = document.add_paragraph()
    add_text(paragraph, " ".join(paragraph_buffer))
    paragraph_buffer.clear()


for raw_line in lines:
    line = raw_line.strip()

    if not line:
        flush_paragraph()
        continue

    if line == "---":
        flush_paragraph()
        continue

    heading_match = re.match(r"^(#{1,3})\s+(.+)$", line)
    if heading_match:
        flush_paragraph()
        level = len(heading_match.group(1))
        text = clean_markdown(heading_match.group(2))
        if level == 1 and not document.paragraphs:
            paragraph = document.add_paragraph(style="Title")
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            paragraph.add_run(text)
        else:
            document.add_heading(text, level=level)
        continue

    if re.match(r"^[-*]\s+", line):
        flush_paragraph()
        paragraph = document.add_paragraph(style="List Bullet")
        add_text(paragraph, re.sub(r"^[-*]\s+", "", line))
        continue

    if re.match(r"^\d+\.\s+", line):
        flush_paragraph()
        paragraph = document.add_paragraph(style="List Number")
        add_text(paragraph, re.sub(r"^\d+\.\s+", "", line))
        continue

    paragraph_buffer.append(line)

flush_paragraph()

document.core_properties.title = (
    "Supraorbital versus infraorbital external trigeminal nerve stimulation "
    "for migraine prevention"
)
document.core_properties.subject = "Revised randomized trial manuscript"
document.core_properties.language = "en-US"
document.save(OUTPUT)

print(OUTPUT)
