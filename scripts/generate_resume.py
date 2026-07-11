from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "nicholas-nguyen-resume.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

GREEN = colors.HexColor("#145c38")
DARK = colors.HexColor("#111814")
MUTED = colors.HexColor("#4e5b53")
LIGHT = colors.HexColor("#e7eee9")

styles = getSampleStyleSheet()
name_style = ParagraphStyle(
    "Name",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=21,
    leading=23,
    textColor=DARK,
    spaceAfter=2,
)
role_style = ParagraphStyle(
    "Role",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=9.5,
    leading=12,
    textColor=GREEN,
)
contact_style = ParagraphStyle(
    "Contact",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=7.5,
    leading=10,
    alignment=TA_RIGHT,
    textColor=MUTED,
)
section_style = ParagraphStyle(
    "Section",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=8.5,
    leading=10,
    textColor=GREEN,
    spaceBefore=5,
    spaceAfter=3,
    uppercase=True,
)
body_style = ParagraphStyle(
    "Body",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.2,
    leading=11.2,
    textColor=DARK,
    spaceAfter=2,
)
small_style = ParagraphStyle(
    "Small",
    parent=body_style,
    fontSize=7.6,
    leading=10.2,
    textColor=MUTED,
)
item_title_style = ParagraphStyle(
    "ItemTitle",
    parent=body_style,
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=11,
    spaceAfter=0,
)
date_style = ParagraphStyle(
    "Date",
    parent=small_style,
    alignment=TA_RIGHT,
    fontName="Helvetica-Bold",
)
bullet_style = ParagraphStyle(
    "Bullet",
    parent=body_style,
    leftIndent=9,
    firstLineIndent=-6,
    bulletIndent=0,
    spaceAfter=1,
)


def section(title: str):
    return [
        Paragraph(title.upper(), section_style),
        HRFlowable(width="100%", thickness=0.6, color=LIGHT, spaceAfter=3),
    ]


story = []
header = Table(
    [[
        [Paragraph("Nicholas Nguyen", name_style), Paragraph("SOFTWARE ENGINEER", role_style)],
        Paragraph(
            '<link href="mailto:gianghi30032005@gmail.com">gianghi30032005@gmail.com</link><br/>'
            '<link href="https://nghi-creator.github.io/">nghi-creator.github.io</link><br/>'
            '<link href="https://github.com/Nghi-creator">github.com/Nghi-creator</link><br/>'
            '<link href="https://www.linkedin.com/in/nicholas-nguyen-3bb17a335/">LinkedIn</link>',
            contact_style,
        ),
    ]],
    colWidths=[120 * mm, 55 * mm],
)
header.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
]))
story.extend([header, Spacer(1, 3 * mm)])

story += section("Summary")
story.append(Paragraph(
    "Aspiring software engineer focused on robust, scalable products, cloud infrastructure, and low-latency systems. "
    "Builds full-stack applications with production-minded architecture and a strong interest in cloud gaming.",
    body_style,
))

story += section("Experience")
experience_header = Table(
    [[
        Paragraph("Full Stack Engineer Intern - TMA Solutions", item_title_style),
        Paragraph("Jun 2026 - Aug 2026<br/>Ho Chi Minh City, Vietnam", date_style),
    ]],
    colWidths=[125 * mm, 50 * mm],
)
experience_header.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
]))
story.append(experience_header)
for bullet in [
    "Developing end-to-end features for an AI-driven project management application using MongoDB, Express.js, React, and Node.js.",
    "Writing and optimizing SQL queries while working with NoSQL data for complex datasets.",
    "Building API test suites and contributing through Agile sprints, code reviews, and engineering collaboration.",
]:
    story.append(Paragraph(f"• {bullet}", bullet_style))

story += section("Projects")
for title, subtitle, description, decision in [
    (
        "PIXELATED Studio Edition",
        "TypeScript, React, Supabase, Vercel",
        "Creator workspace for managing browser gameplay experiences, local builds, submissions, and stream research.",
        "Separated creator tooling from the user-facing client so each workflow can evolve independently.",
    ),
    (
        "PIXELATED User Edition",
        "TypeScript, React, Web APIs, Vercel",
        "User-facing companion for discovering and accessing experiences produced through Studio Edition.",
        "Kept authoring and playback concerns in separate deployable applications to reduce coupling.",
    ),
]:
    story.append(Paragraph(title, item_title_style))
    story.append(Paragraph(subtitle, small_style))
    story.append(Paragraph(f"{description} <b>Technical decision:</b> {decision}", body_style))

story += section("Technical Skills")
skills_table = Table(
    [
        [Paragraph("Languages", item_title_style), Paragraph("TypeScript, Java, SQL", body_style)],
        [Paragraph("Web", item_title_style), Paragraph("React, Node.js, Express.js, REST APIs", body_style)],
        [Paragraph("Data", item_title_style), Paragraph("PostgreSQL, MongoDB, Supabase", body_style)],
        [Paragraph("Cloud & DevOps", item_title_style), Paragraph("AWS, GCP, Docker, Terraform", body_style)],
    ],
    colWidths=[36 * mm, 139 * mm],
)
skills_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 1),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
]))
story.append(skills_table)

story += section("Education & Certifications")
education_table = Table(
    [[
        [
            Paragraph("VNUHCM - University of Science", item_title_style),
            Paragraph("B.S. Information Technology", body_style),
            Paragraph("Sep 2023 - May 2027", small_style),
        ],
        [
            Paragraph("AWS Certified Cloud Practitioner", body_style),
            Paragraph("AWS Academy Cloud Architecting", body_style),
            Paragraph("IELTS Academic", body_style),
        ],
    ]],
    colWidths=[92 * mm, 83 * mm],
)
education_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (0, 0), 0),
    ("RIGHTPADDING", (0, 0), (0, 0), 7),
    ("LEFTPADDING", (1, 0), (1, 0), 7),
    ("RIGHTPADDING", (1, 0), (1, 0), 0),
    ("LINEBEFORE", (1, 0), (1, 0), 0.5, LIGHT),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
]))
story.append(education_table)

doc = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=17 * mm,
    leftMargin=17 * mm,
    topMargin=14 * mm,
    bottomMargin=13 * mm,
    title="Nicholas Nguyen - Software Engineer Resume",
    author="Nicholas Nguyen",
)
doc.build(story)
print(OUTPUT)
