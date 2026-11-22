# -*- coding: utf-8 -*-
"""Build the chapter 3 insertion document with Word built-in heading styles."""
import os
import re

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Cm, Pt
from docx.oxml.ns import qn

HERE = os.path.dirname(os.path.abspath(__file__))
MD = os.path.join(HERE, os.pardir, 'docs', 'thesis', '第3章_草稿.md')
OUT = os.path.join(HERE, 'chapter3_insert.docx')
FIGDIR = os.path.join(HERE, os.pardir, 'docs', 'thesis', 'figures')

IMG_W_CM = {
    'fig3-1': 14.5, 'fig3-2': 14.5, 'fig3-3': 14.5, 'fig3-4': 14.5,
    'fig3-5': 10.5, 'fig3-6': 10.5, 'fig3-7': 14.5, 'fig3-8': 14.5,
    'fig3-9': 14.5, 'fig3-10': 14.5,
}


def fmt_run(run, east='宋体', size=12, bold=False):
    run.font.name = 'Times New Roman'
    run.font.size = Pt(size)
    run.font.bold = bold
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.get_or_add_rFonts()
    rfonts.set(qn('w:eastAsia'), east)


def set_indent_chars(p, chars):
    ppr = p._p.get_or_add_pPr()
    ind = ppr.find(qn('w:ind'))
    if ind is None:
        ind = ppr.makeelement(qn('w:ind'), {})
        ppr.append(ind)
    ind.set(qn('w:firstLineChars'), str(chars * 100))
    ind.set(qn('w:firstLine'), str(int(chars * 240)))


def add_heading(doc, text, level):
    style = {1: 'Heading 1', 2: 'Heading 2', 3: 'Heading 3'}[level]
    p = doc.add_paragraph(style=style)
    p.paragraph_format.alignment = (
        WD_ALIGN_PARAGRAPH.CENTER if level == 1 else WD_ALIGN_PARAGRAPH.JUSTIFY
    )
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(12 if level == 1 else 0)
    p.paragraph_format.line_spacing = 1.0
    size = {1: 22, 2: 16, 3: 14}[level]
    bold = level != 1
    fmt_run(p.add_run(text), east='黑体', size=size, bold=bold)
    return p


def add_body(doc, text):
    p = doc.add_paragraph(style='Normal')
    pf = p.paragraph_format
    pf.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pf.space_before = Pt(0)
    pf.space_after = Pt(0)
    pf.line_spacing = 1.5
    set_indent_chars(p, 2)
    fmt_run(p.add_run(text), east='宋体', size=12)
    return p


def add_caption(doc, text):
    p = doc.add_paragraph(style='Normal')
    pf = p.paragraph_format
    pf.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pf.space_before = Pt(0)
    pf.space_after = Pt(0)
    pf.line_spacing = 1.0
    fmt_run(p.add_run(text), east='宋体', size=10.5)
    return p


def add_table(doc, rows):
    ncol = len(rows[0])
    table = doc.add_table(rows=len(rows), cols=ncol)
    table.style = 'Table Grid'
    width = Cm(14.65 / ncol)
    for column in table.columns:
        column.width = width
    for ri, row in enumerate(rows):
        for ci, text in enumerate(row):
            cell = table.cell(ri, ci)
            p = cell.paragraphs[0]
            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.line_spacing = 1.0
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            fmt_run(p.add_run(text), east='宋体', size=10.5, bold=(ri == 0))
    return table


def add_figure(doc, name, caption):
    p = doc.add_paragraph(style='Normal')
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.line_spacing = 1.0
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.add_run().add_picture(
        os.path.join(FIGDIR, name + '.png'), width=Cm(IMG_W_CM[name])
    )
    add_caption(doc, caption)


def parse_md():
    with open(MD, encoding='utf-8') as f:
        lines = f.read().splitlines()
    blocks = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith('|') and line.rstrip().endswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|') and lines[i].rstrip().endswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not re.match(r'^-+$', cells[0]):
                    rows.append(cells)
                i += 1
            blocks.append(('table', rows))
            continue
        image = re.match(r'^!\[(.+)\]\((.+)\)$', line)
        if image:
            stem = os.path.splitext(os.path.basename(image.group(2)))[0]
            blocks.append(('image', (stem, image.group(1))))
            i += 1
            continue
        tabcap = re.match(r'^\*\*(.+)\*\*$', line)
        if tabcap:
            blocks.append(('caption', tabcap.group(1)))
            i += 1
            continue
        for pattern, kind in (
            (r'^###\s+(.+)$', 'h3'),
            (r'^##\s+(.+)$', 'h2'),
            (r'^#\s+(.+)$', 'h1'),
        ):
            match = re.match(pattern, line)
            if match:
                blocks.append((kind, match.group(1)))
                i += 1
                break
        else:
            if line.strip():
                blocks.append(('body', line.strip()))
            i += 1
    return blocks


def main():
    doc = Document()
    section = doc.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.left_margin = section.right_margin = Cm(3.17)
    section.top_margin = section.bottom_margin = Cm(2.54)

    counts = {'h1': 0, 'h2': 0, 'h3': 0, 'table': 0, 'image': 0}
    for kind, data in parse_md():
        if kind == 'h1':
            add_heading(doc, data, 1)
            counts['h1'] += 1
        elif kind == 'h2':
            add_heading(doc, data, 2)
            counts['h2'] += 1
        elif kind == 'h3':
            add_heading(doc, data, 3)
            counts['h3'] += 1
        elif kind == 'body':
            add_body(doc, data)
        elif kind == 'caption':
            add_caption(doc, data)
        elif kind == 'table':
            add_table(doc, data)
            counts['table'] += 1
        elif kind == 'image':
            add_figure(doc, data[0], data[1])
            counts['image'] += 1

    doc.save(OUT)
    print('saved:', OUT)
    print('counts:', counts)


if __name__ == '__main__':
    main()
