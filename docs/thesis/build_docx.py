# -*- coding: utf-8 -*-
"""
将 第3章_草稿.md 排版为 Word 文档（工具脚本，非论文内容）。
基于 python-docx 生成（成熟库，兼容性有保障）。
格式依据原毕业论文 .doc 实测值：
  章标题：黑体 22pt 居中；节标题：黑体 16pt 加粗左对齐；
  正文：宋体 12pt、1.5 倍行距、段前段后 5 磅、首行缩进 2 字符；
  表题/图题：宋体 10.5pt 居中；表格：Table Grid 全边框、宋体 10.5pt、居中。
"""
import os
import re

from docx import Document
from docx.shared import Cm, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn

HERE = os.path.dirname(os.path.abspath(__file__))
MD = os.path.join(HERE, '第3章_草稿.md')
OUT = os.path.join(HERE, '第3章 系统分析与设计.docx')
FIGDIR = os.path.join(HERE, 'figures')

IMG_W_CM = {'fig3-1': 14.5, 'fig3-2': 14.5, 'fig3-3': 14.5, 'fig3-4': 14.5,
            'fig3-5': 10.5, 'fig3-6': 10.5, 'fig3-7': 14.5, 'fig3-8': 14.5,
            'fig3-9': 14.5, 'fig3-10': 14.5}


def fmt_run(run, east='宋体', size=12, bold=False):
    run.font.name = 'Times New Roman'   # w:ascii / w:hAnsi
    run.font.size = Pt(size)
    run.font.bold = bold
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.get_or_add_rFonts()
    rfonts.set(qn('w:eastAsia'), east)  # 中文用指定字体


def fmt_para(p, align=None, line=1.5, before=None, after=None,
             indent_chars=0, indent_pt=0, outline=None):
    pf = p.paragraph_format
    if align is not None:
        pf.alignment = align
    pf.line_spacing = line
    if before is not None:
        pf.space_before = Pt(before)
    if after is not None:
        pf.space_after = Pt(after)
    if indent_pt:
        pf.first_line_indent = Pt(indent_pt)
    if outline is not None:
        ppr = p._element.get_or_add_pPr()
        from docx.oxml import OxmlElement
        ol = OxmlElement('w:outlineLvl')
        ol.set(qn('w:val'), str(outline))
        ppr.append(ol)


def add_para(doc, text, kind):
    p = doc.add_paragraph()
    if kind == 'chap':
        fmt_para(p, align=WD_ALIGN_PARAGRAPH.CENTER, line=1.0, outline=0)
        fmt_run(p.add_run(text), east='黑体', size=22)
    elif kind in ('sec', 'sub'):
        fmt_para(p, line=1.0, outline=(1 if kind == 'sec' else 2))
        fmt_run(p.add_run(text), east='黑体', size=16, bold=True)
    elif kind == 'caption':
        fmt_para(p, align=WD_ALIGN_PARAGRAPH.CENTER)
        fmt_run(p.add_run(text), size=10.5)
    else:  # body
        fmt_para(p, before=5, after=5, indent_pt=24)
        fmt_run(p.add_run(text), size=12)
    return p


def add_table(doc, rows):
    ncol = len(rows[0])
    t = doc.add_table(rows=len(rows), cols=ncol)
    t.style = 'Table Grid'
    colw = Cm(14.65 / ncol)
    for c in t.columns:
        c.width = colw
    for ri, row in enumerate(rows):
        for ci, text in enumerate(row):
            cell = t.cell(ri, ci)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.line_spacing = 1.0
            fmt_run(p.add_run(text), size=10.5, bold=(ri == 0))
    return t


def add_figure(doc, name, caption):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.line_spacing = 1.0
    p.add_run().add_picture(os.path.join(FIGDIR, name + '.png'),
                            width=Cm(IMG_W_CM[name]))
    cap = doc.add_paragraph()
    fmt_para(cap, align=WD_ALIGN_PARAGRAPH.CENTER)
    fmt_run(cap.add_run(caption), size=10.5)


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
        m = re.match(r'^!\[(.+)\]\((.+)\)$', line)
        if m:
            blocks.append(('image', (os.path.splitext(os.path.basename(m.group(2)))[0], m.group(1))))
            i += 1
            continue
        m = re.match(r'^\*\*(.+)\*\*$', line)
        if m:
            blocks.append(('tabcap', m.group(1)))
            i += 1
            continue
        for pat, kind in ((r'^###\s+(.+)$', 'sub'), (r'^##\s+(.+)$', 'sec'),
                          (r'^#\s+(.+)$', 'chap'), ):
            m = re.match(pat, line)
            if m:
                blocks.append((kind, m.group(1)))
                i += 1
                break
        else:
            if line.strip():
                blocks.append(('body', line.strip()))
            i += 1
    return blocks


def main():
    doc = Document()
    sec = doc.sections[0]
    sec.page_width = Cm(21.0)
    sec.page_height = Cm(29.7)
    sec.left_margin = sec.right_margin = Cm(3.17)
    sec.top_margin = sec.bottom_margin = Cm(2.54)

    ntab = nimg = 0
    for kind, data in parse_md():
        if kind == 'table':
            add_table(doc, data)
            ntab += 1
        elif kind == 'image':
            add_figure(doc, data[0], data[1])
            nimg += 1
        elif kind == 'tabcap':
            p = doc.add_paragraph()
            fmt_para(p, align=WD_ALIGN_PARAGRAPH.CENTER)
            fmt_run(p.add_run(data), size=10.5)
        else:
            add_para(doc, data, kind)

    doc.save(OUT)
    print('已保存:', OUT)
    print('表格数=%d 图片数=%d' % (ntab, nimg))


if __name__ == '__main__':
    main()
