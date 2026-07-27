# -*- coding: utf-8 -*-
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                 TableStyle, ListFlowable, ListItem, KeepTogether)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from content import BLOCKS

FONT_DIR = "/usr/share/fonts/truetype/dejavu/"
pdfmetrics.registerFont(TTFont('DejaVu', FONT_DIR + 'DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVu-Bold', FONT_DIR + 'DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVu-Mono', FONT_DIR + 'DejaVuSansMono.ttf'))

BOLD_RE = re.compile(r"\*\*(.+?)\*\*")

def md_to_html(text):
    return BOLD_RE.sub(r"<b>\1</b>", text)

styles = getSampleStyleSheet()

title_style = ParagraphStyle('TitleX', fontName='DejaVu-Bold', fontSize=15, leading=19,
                              alignment=TA_CENTER, spaceAfter=16)
h1_style = ParagraphStyle('H1X', fontName='DejaVu-Bold', fontSize=13, leading=16,
                           spaceBefore=14, spaceAfter=8, textColor=colors.HexColor('#1F3864'))
h2_style = ParagraphStyle('H2X', fontName='DejaVu-Bold', fontSize=11.5, leading=14,
                           spaceBefore=10, spaceAfter=6, textColor=colors.HexColor('#2E5395'))
h3_style = ParagraphStyle('H3X', fontName='DejaVu-Bold', fontSize=10.5, leading=13,
                           spaceBefore=8, spaceAfter=5, textColor=colors.HexColor('#2E5395'))
body_style = ParagraphStyle('BodyX', fontName='DejaVu', fontSize=9.7, leading=13.5,
                             alignment=TA_JUSTIFY, spaceAfter=7)
mono_style = ParagraphStyle('MonoX', fontName='DejaVu-Mono', fontSize=8.5, leading=11,
                             leftIndent=14, spaceAfter=7)
cap_style = ParagraphStyle('CapX', fontName='DejaVu-Bold', fontSize=8.3, leading=10.5,
                            spaceBefore=8, spaceAfter=4)
cell_style = ParagraphStyle('CellX', fontName='DejaVu', fontSize=7.6, leading=9.6)
cell_head_style = ParagraphStyle('CellHeadX', fontName='DejaVu-Bold', fontSize=7.8, leading=9.8,
                                  textColor=colors.white)
list_style = ParagraphStyle('ListX', fontName='DejaVu', fontSize=9.7, leading=13.5,
                             alignment=TA_JUSTIFY)
ref_style = ParagraphStyle('RefX', fontName='DejaVu', fontSize=8.6, leading=11.5,
                            leftIndent=14, firstLineIndent=-14, spaceAfter=4)

def P(text, style=body_style):
    return Paragraph(md_to_html(text), style)

def build_table_flowable(caption, headers, rows, col_widths=None):
    n = len(headers)
    avail_width = 17.2 * cm
    if col_widths is None:
        if n <= 4:
            first = avail_width * 0.28
            rest = (avail_width - first) / (n - 1)
            col_widths = [first] + [rest] * (n - 1)
        else:
            first = avail_width * 0.20
            rest = (avail_width - first) / (n - 1)
            col_widths = [first] + [rest] * (n - 1)

    header_row = [Paragraph(md_to_html(h), cell_head_style) for h in headers]
    data = [header_row]
    for row in rows:
        data.append([Paragraph(md_to_html(str(c)), cell_style) for c in row])

    tbl = Table(data, colWidths=col_widths, repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2E5395')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#888888')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F2F5FA')]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))
    return [Paragraph(md_to_html(caption), cap_style), tbl, Spacer(1, 8)]

def build():
    doc = SimpleDocTemplate(
        "/workspace/paper_output/TENS_Migraine_Manuscript_Final.pdf",
        pagesize=A4,
        leftMargin=2.0 * cm, rightMargin=2.0 * cm,
        topMargin=1.8 * cm, bottomMargin=1.8 * cm,
        title="TENS Migraine Manuscript - Final",
    )

    story = []

    for block in BLOCKS:
        kind = block[0]

        if kind == 'title':
            story.append(P(block[1], title_style))
            story.append(Spacer(1, 6))

        elif kind == 'h1':
            story.append(Spacer(1, 4))
            story.append(P(block[1], h1_style))

        elif kind == 'h2':
            story.append(P(block[1], h2_style))

        elif kind == 'h3':
            story.append(P(block[1], h3_style))

        elif kind == 'p':
            story.append(P(block[1], body_style))

        elif kind == 'mono':
            for line in block[1].split('\n'):
                story.append(Paragraph(line.replace(' ', '&nbsp;'), mono_style))

        elif kind == 'bullet':
            items = [ListItem(P(t, list_style), leftIndent=14) for t in block[1]]
            story.append(ListFlowable(items, bulletType='bullet', start='circle',
                                       leftIndent=16, spaceBefore=2, spaceAfter=8))

        elif kind == 'numlist':
            items = [ListItem(P(t, list_style), leftIndent=16) for t in block[1]]
            story.append(ListFlowable(items, bulletType='1', leftIndent=18,
                                       spaceBefore=2, spaceAfter=8))

        elif kind == 'table':
            caption, headers, rows = block[1], block[2], block[3]
            for fl in build_table_flowable(caption, headers, rows):
                story.append(fl)

        elif kind == 'reflist':
            for i, ref in enumerate(block[1], start=1):
                story.append(Paragraph(f"{i}.&nbsp;&nbsp;{md_to_html(ref)}", ref_style))

    doc.build(story)
    print("Saved: /workspace/paper_output/TENS_Migraine_Manuscript_Final.pdf")

if __name__ == '__main__':
    build()
