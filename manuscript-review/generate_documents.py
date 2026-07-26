#!/usr/bin/env python3
"""Build iPhone-friendly HTML and DOCX from the manuscript review package."""

from __future__ import annotations

import html
import argparse
import re
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "exports"
SECTIONS = [
    ("گزارش داوری تخصصی Q1", ROOT / "Q1_REVIEW_FA.md", "rtl", "fa"),
    ("ممیزی و به‌روزرسانی منابع", ROOT / "REFERENCE_AUDIT_FA.md", "rtl", "fa"),
    ("Revised English Manuscript", ROOT / "REVISED_MANUSCRIPT.md", "ltr", "en"),
]


def has_persian(text: str) -> bool:
    return bool(re.search(r"[\u0600-\u06ff]", text))


def clean_inline(text: str) -> str:
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 (\2)", text)
    text = text.replace("**", "").replace("__", "").replace("`", "")
    text = re.sub(r"(?<!\*)\*(?!\*)", "", text)
    return text.strip()


def inline_html(text: str) -> str:
    escaped = html.escape(text)
    escaped = re.sub(
        r"\[([^\]]+)\]\((https?://[^)]+)\)",
        r'<a href="\2">\1</a>',
        escaped,
    )
    escaped = re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    escaped = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", escaped)
    return escaped


def is_separator_row(line: str) -> bool:
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", c) for c in cells)


def markdown_to_html(markdown: str, direction: str, lang: str) -> str:
    lines = markdown.splitlines()
    out: list[str] = []
    paragraph: list[str] = []
    in_list = False
    in_quote = False
    i = 0

    def flush_paragraph() -> None:
        nonlocal paragraph
        if paragraph:
            text = " ".join(part.strip() for part in paragraph)
            out.append(f"<p>{inline_html(text)}</p>")
            paragraph = []

    def close_blocks() -> None:
        nonlocal in_list, in_quote
        flush_paragraph()
        if in_list:
            out.append("</ul>")
            in_list = False
        if in_quote:
            out.append("</blockquote>")
            in_quote = False

    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()

        if stripped.startswith("|") and i + 1 < len(lines) and is_separator_row(lines[i + 1]):
            close_blocks()
            headers = [c.strip() for c in stripped.strip("|").split("|")]
            i += 2
            rows: list[list[str]] = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            out.append('<div class="table-wrap"><table><thead><tr>')
            out.extend(f"<th>{inline_html(cell)}</th>" for cell in headers)
            out.append("</tr></thead><tbody>")
            for row in rows:
                out.append("<tr>")
                out.extend(f"<td>{inline_html(cell)}</td>" for cell in row)
                out.append("</tr>")
            out.append("</tbody></table></div>")
            continue

        heading = re.match(r"^(#{1,6})\s+(.+)$", stripped)
        if heading:
            close_blocks()
            level = min(len(heading.group(1)) + 1, 6)
            out.append(f"<h{level}>{inline_html(heading.group(2))}</h{level}>")
        elif stripped in {"---", "***", "___"}:
            close_blocks()
            out.append("<hr>")
        elif stripped.startswith(">"):
            flush_paragraph()
            if in_list:
                out.append("</ul>")
                in_list = False
            if not in_quote:
                out.append("<blockquote>")
                in_quote = True
            out.append(f"<p>{inline_html(stripped.lstrip('> ').strip())}</p>")
        elif re.match(r"^[-*+]\s+", stripped):
            flush_paragraph()
            if in_quote:
                out.append("</blockquote>")
                in_quote = False
            if not in_list:
                out.append("<ul>")
                in_list = True
            item = re.sub(r"^[-*+]\s+", "", stripped)
            out.append(f"<li>{inline_html(item)}</li>")
        elif re.match(r"^\d+\.\s+", stripped):
            flush_paragraph()
            if in_quote:
                out.append("</blockquote>")
                in_quote = False
            if not in_list:
                out.append('<ul class="numbered">')
                in_list = True
            out.append(f"<li>{inline_html(stripped)}</li>")
        elif not stripped:
            close_blocks()
        else:
            if in_list:
                out.append("</ul>")
                in_list = False
            if in_quote:
                out.append("</blockquote>")
                in_quote = False
            paragraph.append(stripped)
        i += 1

    close_blocks()
    return f'<section dir="{direction}" lang="{lang}">' + "\n".join(out) + "</section>"


def build_html(
    sections=SECTIONS,
    basename: str = "Q1_Manuscript_Review_iPhone",
    cover_title: str = "بسته کامل داوری و اصلاح مقاله",
    subtitle: str = "داوری تخصصی Q1، ممیزی منابع و نسخه اصلاحی انگلیسی",
) -> Path:
    standalone_ltr = len(sections) == 1 and sections[0][2] == "ltr"
    root_direction = "ltr" if standalone_ltr else "rtl"
    root_language = "en" if standalone_ltr else "fa"
    contents_label = "Contents" if standalone_ltr else "فهرست مطالب"
    edition_label = "iPhone-friendly edition" if standalone_ltr else "نسخه مناسب مطالعه در آیفون"
    toc = []
    bodies = []
    for index, (title, path, direction, lang) in enumerate(sections, start=1):
        toc.append(f'<li><a href="#section-{index}">{html.escape(title)}</a></li>')
        body = markdown_to_html(path.read_text(encoding="utf-8"), direction, lang)
        bodies.append(
            f'<div class="section-break" id="section-{index}">'
            f'<h1 dir="{direction}">{html.escape(title)}</h1>{body}</div>'
        )

    generated = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    document = f"""<!doctype html>
<html lang="{root_language}" dir="{root_direction}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(cover_title)}</title>
<style>
@page {{ size: A4; margin: 16mm 14mm 18mm; }}
* {{ box-sizing: border-box; }}
body {{
  margin: 0 auto; max-width: 900px; color: #18212f; background: white;
  font-family: "Noto Naskh Arabic", "Noto Sans Arabic", Arial, sans-serif;
  font-size: 11.5pt; line-height: 1.65;
}}
.cover {{ min-height: 92vh; display: flex; flex-direction: column; justify-content: center; text-align: center; }}
.cover h1 {{ color: #173c6b; font-size: 26pt; margin-bottom: 14px; }}
.cover p {{ color: #53657a; font-size: 13pt; }}
.toc {{ page-break-before: always; }}
.toc a {{ color: #173c6b; text-decoration: none; }}
.section-break {{ page-break-before: always; }}
section[dir="ltr"] {{
  font-family: Arial, "Noto Sans", sans-serif; text-align: left;
  direction: ltr; line-height: 1.5;
}}
section[dir="rtl"] {{ text-align: right; direction: rtl; }}
h1, h2, h3, h4, h5, h6 {{ color: #173c6b; page-break-after: avoid; line-height: 1.35; }}
h1 {{ font-size: 22pt; border-bottom: 2px solid #dbe5f0; padding-bottom: 8px; }}
h2 {{ font-size: 17pt; margin-top: 25px; }}
h3 {{ font-size: 14pt; margin-top: 20px; }}
p, li {{ orphans: 3; widows: 3; }}
blockquote {{ margin: 14px 0; padding: 8px 14px; background: #f3f6f9; border-right: 4px solid #7193b8; }}
section[dir="ltr"] blockquote {{ border-right: 0; border-left: 4px solid #7193b8; }}
code {{ font-family: "DejaVu Sans Mono", monospace; background: #eef2f6; padding: 1px 4px; border-radius: 3px; }}
.table-wrap {{ width: 100%; overflow: hidden; margin: 12px 0 18px; }}
table {{ width: 100%; border-collapse: collapse; font-size: 8.7pt; page-break-inside: auto; }}
tr {{ page-break-inside: avoid; }}
th, td {{ border: 1px solid #b9c6d4; padding: 5px 6px; vertical-align: top; overflow-wrap: anywhere; }}
th {{ background: #e9eff6; color: #173c6b; }}
hr {{ border: 0; border-top: 1px solid #cfd9e4; margin: 22px 0; }}
a {{ color: #1a5a96; overflow-wrap: anywhere; }}
@media screen and (max-width: 600px) {{
  body {{ padding: 14px; font-size: 16px; }}
  .cover {{ min-height: 80vh; }}
  h1 {{ font-size: 27px; }}
  h2 {{ font-size: 22px; }}
  table {{ font-size: 12px; }}
}}
</style>
</head>
<body>
<div class="cover" dir="{root_direction}">
  <h1>{html.escape(cover_title)}</h1>
  <p>{html.escape(subtitle)}</p>
  <p>{edition_label} — {generated}</p>
</div>
<div class="toc">
  <h1>{contents_label}</h1>
  <ol>{''.join(toc)}</ol>
</div>
{''.join(bodies)}
</body>
</html>"""
    output_path = OUTPUT / f"{basename}.html"
    output_path.write_text(document, encoding="utf-8")
    return output_path


def xml_text(text: str) -> str:
    return escape(clean_inline(text))


def run_xml(text: str, bold: bool = False, size: int = 23) -> str:
    bold_xml = "<w:b/>" if bold else ""
    return (
        "<w:r><w:rPr>"
        f"{bold_xml}<w:sz w:val=\"{size}\"/><w:szCs w:val=\"{size}\"/>"
        '<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Noto Naskh Arabic"/>'
        f"</w:rPr><w:t xml:space=\"preserve\">{xml_text(text)}</w:t></w:r>"
    )


def paragraph_xml(
    text: str,
    *,
    style: str | None = None,
    bold: bool = False,
    size: int = 23,
    force_rtl: bool | None = None,
) -> str:
    rtl = has_persian(text) if force_rtl is None else force_rtl
    props = []
    if style:
        props.append(f'<w:pStyle w:val="{style}"/>')
    if rtl:
        props.extend(["<w:bidi/>", '<w:jc w:val="right"/>'])
    else:
        props.append('<w:jc w:val="left"/>')
    props.extend(['<w:spacing w:after="110" w:line="330" w:lineRule="auto"/>', "<w:keepNext/>" if style else ""])
    return f"<w:p><w:pPr>{''.join(props)}</w:pPr>{run_xml(text, bold, size)}</w:p>"


def table_xml(rows: list[list[str]]) -> str:
    if not rows:
        return ""
    width = max(len(row) for row in rows)
    normalized = [row + [""] * (width - len(row)) for row in rows]
    table = [
        "<w:tbl><w:tblPr>",
        '<w:tblW w:w="0" w:type="auto"/>',
        '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="AAB8C6"/>'
        '<w:left w:val="single" w:sz="4" w:color="AAB8C6"/>'
        '<w:bottom w:val="single" w:sz="4" w:color="AAB8C6"/>'
        '<w:right w:val="single" w:sz="4" w:color="AAB8C6"/>'
        '<w:insideH w:val="single" w:sz="4" w:color="C9D3DE"/>'
        '<w:insideV w:val="single" w:sz="4" w:color="C9D3DE"/></w:tblBorders>',
        "</w:tblPr><w:tblGrid>",
    ]
    table.extend('<w:gridCol w:w="1800"/>' for _ in range(width))
    table.append("</w:tblGrid>")
    for row_index, row in enumerate(normalized):
        table.append("<w:tr>")
        for cell in row:
            shade = '<w:shd w:fill="E9EFF6"/>' if row_index == 0 else ""
            table.append(f"<w:tc><w:tcPr>{shade}</w:tcPr>")
            table.append(paragraph_xml(cell, bold=row_index == 0, size=18))
            table.append("</w:tc>")
        table.append("</w:tr>")
    table.append("</w:tbl>")
    return "".join(table)


def markdown_to_docx_xml(markdown: str, default_rtl: bool) -> str:
    lines = markdown.splitlines()
    body: list[str] = []
    i = 0
    while i < len(lines):
        stripped = lines[i].strip()
        if stripped.startswith("|") and i + 1 < len(lines) and is_separator_row(lines[i + 1]):
            headers = [clean_inline(c.strip()) for c in stripped.strip("|").split("|")]
            i += 2
            rows = [headers]
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append([clean_inline(c.strip()) for c in lines[i].strip().strip("|").split("|")])
                i += 1
            body.append(table_xml(rows))
            continue
        heading = re.match(r"^(#{1,6})\s+(.+)$", stripped)
        if heading:
            level = min(len(heading.group(1)), 3)
            body.append(paragraph_xml(heading.group(2), style=f"Heading{level}", bold=True, size=32 - 4 * level))
        elif stripped in {"---", "***", "___"}:
            body.append(paragraph_xml("────────────────────────", size=18, force_rtl=default_rtl))
        elif re.match(r"^[-*+]\s+", stripped):
            item = "• " + re.sub(r"^[-*+]\s+", "", stripped)
            body.append(paragraph_xml(item, size=22))
        elif stripped.startswith(">"):
            body.append(paragraph_xml("نکته: " + stripped.lstrip("> ").strip(), size=21))
        elif stripped:
            body.append(paragraph_xml(stripped, size=22))
        i += 1
    return "".join(body)


def build_docx(
    sections=SECTIONS,
    basename: str = "Q1_Manuscript_Review_iPhone",
    cover_title: str = "بسته کامل داوری و اصلاح مقاله",
    subtitle: str = "داوری تخصصی Q1، ممیزی منابع و نسخه اصلاحی انگلیسی",
    cover_rtl: bool = True,
) -> Path:
    parts = [
        paragraph_xml(cover_title, style="Title", bold=True, size=40, force_rtl=cover_rtl),
        paragraph_xml(
            subtitle,
            bold=True,
            size=26,
            force_rtl=cover_rtl,
        ),
        paragraph_xml(
            "iPhone-friendly edition" if not cover_rtl else "نسخه مناسب مطالعه در آیفون",
            size=22,
            force_rtl=cover_rtl,
        ),
    ]
    for title, path, direction, _lang in sections:
        parts.append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
        parts.append(paragraph_xml(title, style="Title", bold=True, size=36, force_rtl=direction == "rtl"))
        parts.append(markdown_to_docx_xml(path.read_text(encoding="utf-8"), direction == "rtl"))

    document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
{''.join(parts)}
<w:sectPr>
  <w:pgSz w:w="11906" w:h="16838"/>
  <w:pgMar w:top="900" w:right="850" w:bottom="900" w:left="850" w:header="400" w:footer="400"/>
</w:sectPr>
</w:body>
</w:document>"""

    styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr>
      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Noto Naskh Arabic"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr></w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/>
    <w:pPr><w:keepNext/><w:spacing w:after="220"/></w:pPr>
    <w:rPr><w:b/><w:color w:val="173C6B"/><w:sz w:val="40"/><w:szCs w:val="40"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/>
    <w:pPr><w:keepNext/><w:spacing w:before="260" w:after="140"/></w:pPr>
    <w:rPr><w:b/><w:color w:val="173C6B"/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/>
    <w:pPr><w:keepNext/><w:spacing w:before="220" w:after="110"/></w:pPr>
    <w:rPr><w:b/><w:color w:val="244F7B"/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/>
    <w:pPr><w:keepNext/><w:spacing w:before="180" w:after="90"/></w:pPr>
    <w:rPr><w:b/><w:color w:val="315D88"/><w:sz w:val="25"/><w:szCs w:val="25"/></w:rPr>
  </w:style>
</w:styles>"""

    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>"""
    root_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>"""
    document_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    core = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"
 xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Q1 Manuscript Review and Revision Package</dc:title>
  <dc:creator>Manuscript review team</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:modified>
</cp:coreProperties>"""
    app = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
 xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Manuscript Review Exporter</Application>
</Properties>"""

    output_path = OUTPUT / f"{basename}.docx"
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as package:
        package.writestr("[Content_Types].xml", content_types)
        package.writestr("_rels/.rels", root_rels)
        package.writestr("word/document.xml", document_xml)
        package.writestr("word/styles.xml", styles_xml)
        package.writestr("word/_rels/document.xml.rels", document_rels)
        package.writestr("docProps/core.xml", core)
        package.writestr("docProps/app.xml", app)
    return output_path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--manuscript-only",
        action="store_true",
        help="Export only the corrected English manuscript",
    )
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    if args.manuscript_only:
        sections = [("Corrected Manuscript", ROOT / "REVISED_MANUSCRIPT.md", "ltr", "en")]
        basename = "Corrected_Manuscript_iPhone"
        html_path = build_html(
            sections,
            basename,
            "Corrected Manuscript",
            "Revised trial report with updated references",
        )
        docx_path = build_docx(
            sections,
            basename,
            "Corrected Manuscript",
            "Revised trial report with updated references",
            cover_rtl=False,
        )
    else:
        html_path = build_html()
        docx_path = build_docx()
    print(html_path)
    print(docx_path)


if __name__ == "__main__":
    main()
