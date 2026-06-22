"""
AURA-WEAR FYP Document Generator
Combines all 5 parts into a single Word document.
Run: python3 generate_fyp_doc.py
Output: AURA_WEAR_FYP_Document.docx
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'doc_parts'))

from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

from part1 import add_part1
from part2 import add_part2
from part3 import add_part3
from part4 import add_part4
from part5 import add_part5


def set_document_margins(doc):
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.25)
        section.right_margin = Inches(1.25)


def set_default_style(doc):
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(12)


def main():
    print("Creating AURA-WEAR FYP Document...")
    doc = Document()
    set_document_margins(doc)
    set_default_style(doc)

    print("  Adding Part 1: Front Matter + Chapter 1 Proposal...")
    add_part1(doc)

    print("  Adding Part 2: Chapter 2 Analysis...")
    add_part2(doc)

    print("  Adding Part 3: Chapter 3 Design (UC-01 to UC-28)...")
    add_part3(doc)

    print("  Adding Part 4: Chapter 3 continued + Chapter 4 Construction...")
    add_part4(doc)

    print("  Adding Part 5: Chapter 5 Testing + Chapter 6 User Manual...")
    add_part5(doc)

    output_path = os.path.join(os.path.dirname(__file__), 'AURA_WEAR_FYP_Document.docx')
    doc.save(output_path)
    print(f"\n✓ Document saved: {output_path}")

    # Count approximate pages by paragraphs (rough estimate)
    total_paragraphs = len(doc.paragraphs)
    print(f"  Total paragraphs: {total_paragraphs}")
    print(f"  Estimated pages: {total_paragraphs // 25}+")


if __name__ == '__main__':
    main()
