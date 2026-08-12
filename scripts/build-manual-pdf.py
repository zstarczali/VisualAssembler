#!/usr/bin/env python3
"""Render Visual Assembler Manual.md to the bundled A4 PDF."""
from pathlib import Path
from xml.sax.saxutils import escape
import mistune
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted, Table, TableStyle, ListFlowable, ListItem, KeepTogether

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "Visual Assembler Manual.md"
OUTPUT = ROOT / "docs" / "Visual Assembler Manual.pdf"
FONT_DIR = Path("/System/Library/Fonts/Supplemental")

for name, file in (("Manual", "Arial.ttf"), ("Manual-Bold", "Arial Bold.ttf"), ("Manual-Italic", "Arial Italic.ttf"), ("Manual-BoldItalic", "Arial Bold Italic.ttf")):
    pdfmetrics.registerFont(TTFont(name, FONT_DIR / file))
pdfmetrics.registerFontFamily("Manual", normal="Manual", bold="Manual-Bold", italic="Manual-Italic", boldItalic="Manual-BoldItalic")

base = getSampleStyleSheet()
body = ParagraphStyle("body", parent=base["BodyText"], fontName="Manual", fontSize=8.8, leading=13, textColor=colors.HexColor("#222222"), spaceAfter=5)
small = ParagraphStyle("small", parent=body, fontSize=7.5, leading=10)
heads = {level: ParagraphStyle(f"h{level}", parent=base[f"Heading{min(level, 4)}"], fontName="Manual-Bold", fontSize=size, leading=size + 4, spaceBefore=before, spaceAfter=after, keepWithNext=True) for level, size, before, after in ((1, 19, 4, 10), (2, 14, 13, 7), (3, 11, 9, 5), (4, 9.5, 7, 4))}
code = ParagraphStyle("code", parent=body, fontName="Courier", fontSize=7.1, leading=9.2, leftIndent=7, rightIndent=5, borderColor=colors.HexColor("#888888"), borderWidth=.5, borderPadding=6, backColor=colors.HexColor("#F4F4F4"), spaceAfter=7)
quote = ParagraphStyle("quote", parent=body, leftIndent=10, rightIndent=7, borderColor=colors.HexColor("#888888"), borderWidth=.7, borderPadding=6, backColor=colors.HexColor("#F8F8F8"))

def inline(nodes):
    result = []
    for node in nodes or []:
        kind = node.get("type")
        if kind == "text": result.append(escape(node.get("raw", "")))
        elif kind == "codespan": result.append(f'<font name="Courier" backColor="#EBEBEB"> {escape(node.get("raw", ""))} </font>')
        elif kind == "strong": result.append(f'<b>{inline(node.get("children"))}</b>')
        elif kind == "emphasis": result.append(f'<i>{inline(node.get("children"))}</i>')
        elif kind == "link":
            url = escape(node.get("attrs", {}).get("url", ""), {'"': '&quot;'})
            label = inline(node.get("children"))
            result.append(label if url.startswith("#") else f'<a href="{url}" color="#355C8A">{label}</a>')
        elif kind in ("softbreak", "linebreak"): result.append("<br/>")
        elif node.get("children"): result.append(inline(node["children"]))
        else: result.append(escape(node.get("raw", "")))
    return "".join(result)

def make_table(node, width):
    head = next((item for item in node["children"] if item["type"] == "table_head"), None)
    table_body = next((item for item in node["children"] if item["type"] == "table_body"), None)
    rows = []
    if head: rows.append([Paragraph(inline(cell.get("children")), small) for cell in head["children"]])
    if table_body:
        for row in table_body["children"]: rows.append([Paragraph(inline(cell.get("children")), small) for cell in row["children"]])
    columns = max(len(row) for row in rows)
    result = Table(rows, colWidths=[width / columns] * columns, repeatRows=1, hAlign="LEFT")
    result.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E8E8E8")), ("FONTNAME", (0, 0), (-1, 0), "Manual-Bold"), ("GRID", (0, 0), (-1, -1), .35, colors.HexColor("#BBBBBB")), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4), ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
    return result

def render(nodes, width):
    flow = []
    for node in nodes:
        kind = node.get("type")
        if kind == "blank_line": continue
        if kind == "heading": flow.append(Paragraph(inline(node.get("children")), heads.get(node.get("attrs", {}).get("level", 2), heads[4])))
        elif kind in ("paragraph", "block_text"): flow.append(Paragraph(inline(node.get("children")) or " ", body))
        elif kind == "block_code": flow.append(Preformatted(node.get("raw", "").rstrip(), code, maxLineLength=105))
        elif kind == "thematic_break": flow.append(Spacer(1, 7))
        elif kind == "block_quote": flow.append(KeepTogether([Paragraph(inline(child.get("children")) or " ", quote) for child in node.get("children", []) if child.get("children")]))
        elif kind == "table": flow.extend((Spacer(1, 3), make_table(node, width), Spacer(1, 5)))
        elif kind == "list":
            items = [ListItem(render(item.get("children", []), width - 18) or [Paragraph(" ", body)], leftIndent=8) for item in node.get("children", [])]
            ordered = node.get("attrs", {}).get("ordered", False)
            options = dict(bulletType="1", start="1") if ordered else dict(bulletType="bullet", bulletChar="•")
            flow.append(ListFlowable(items, leftIndent=16, bulletFontName="Manual", bulletFontSize=7.5, spaceAfter=5, **options))
        elif node.get("children"): flow.extend(render(node["children"], width))
    return flow

def footer(canvas, document):
    canvas.saveState(); canvas.setFont("Manual", 7); canvas.setFillColor(colors.HexColor("#777777"))
    canvas.drawString(15 * mm, 9 * mm, "C64 Visual Assembler 2.3.0 - User Manual")
    canvas.drawRightString(A4[0] - 15 * mm, 9 * mm, str(document.page)); canvas.restoreState()

tree = mistune.create_markdown(renderer="ast", plugins=["table"])(SOURCE.read_text(encoding="utf-8"))
document = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=15 * mm, leftMargin=15 * mm, topMargin=15 * mm, bottomMargin=17 * mm, title="C64 Visual Assembler User Manual", author="Zsolt Tarczali")
document.build(render(tree, A4[0] - 30 * mm), onFirstPage=footer, onLaterPages=footer)
