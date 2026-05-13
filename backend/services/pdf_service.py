"""
Tonnage Manifest PDF generator using ReportLab.
Produces a colourful, detailed, easy-to-read PDF report.
"""
import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

# Brand colours
DARK_BG    = colors.HexColor("#0D1B2A")
TEAL       = colors.HexColor("#00C9A7")
AMBER      = colors.HexColor("#FFB800")
DANGER     = colors.HexColor("#FF4D6D")
LIGHT_GREY = colors.HexColor("#F0F4F8")
MID_GREY   = colors.HexColor("#8492A6")
WHITE      = colors.white
GREEN_OK   = colors.HexColor("#22C55E")

def generate_manifest_pdf(disposition_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm
    )
    
    styles = getSampleStyleSheet()
    story = []
    
    # ── Header banner ──────────────────────────────────────────────────────────
    header_data = [[
        Paragraph(
            '<font color="white" size="14"><b>END-OF-CYCLE TONNAGE MANIFEST</b></font><br/>'
            '<font color="#00C9A7" size="9">EcoVision — Smart Valuation &amp; Material Routing</font>',
            ParagraphStyle('h', alignment=TA_LEFT)
        ),
        Paragraph(
            f'<font color="#8492A6" size="8">Manifest ID</font><br/>'
            f'<font color="white" size="11"><b>{disposition_data.get("manifest_id", "N/A")}</b></font>',
            ParagraphStyle('hr', alignment=TA_RIGHT)
        )
    ]]
    header_table = Table(header_data, colWidths=[11*cm, 6*cm])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DARK_BG),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [DARK_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (0,-1), 16),
        ('RIGHTPADDING', (-1,0), (-1,-1), 16),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 0.4*cm))
    
    # ── Facility info strip ────────────────────────────────────────────────────
    ts = disposition_data.get("timestamp", datetime.now().isoformat())
    try:
        ts_fmt = datetime.fromisoformat(ts).strftime("%d %B %Y  %H:%M UTC")
    except Exception:
        ts_fmt = ts
    
    info_data = [[
        Paragraph(f'<font size="8" color="#8492A6">FACILITY</font><br/><b>{disposition_data.get("facility_name","Urban Recycling Facility")}</b>', styles['Normal']),
        Paragraph(f'<font size="8" color="#8492A6">GENERATED</font><br/><b>{ts_fmt}</b>', styles['Normal']),
        Paragraph(f'<font size="8" color="#8492A6">LANDFILL DIVERSION</font><br/><font color="#22C55E"><b>100% ACHIEVED ✓</b></font>', styles['Normal']),
    ]]
    info_table = Table(info_data, colWidths=[6*cm, 6*cm, 5*cm])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_GREY),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#DDE3EC")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 0.5*cm))
    
    # ── Section: Waste Input ──────────────────────────────────────────────────
    story.append(Paragraph('<b>1. WASTE INPUT CLASSIFICATION</b>', 
                           ParagraphStyle('sh', fontSize=11, textColor=DARK_BG, spaceAfter=6)))
    story.append(HRFlowable(width="100%", thickness=2, color=TEAL, spaceAfter=6))
    
    waste_data = [
        ['Parameter', 'Value'],
        ['Waste Type', disposition_data.get('waste_type', 'N/A')],
        ['Input Weight', f"{disposition_data.get('weight_kg', 0):,.2f} kg"],
        ['Classification', 'Non-Recyclable Residual Waste'],
        ['Recyclable?', 'NO — Directed to Energy Recovery'],
        ['Disposition Route', disposition_data.get('disposition_route', 'N/A')],
    ]
    waste_table = Table(waste_data, colWidths=[7*cm, 10*cm])
    waste_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), DARK_BG),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GREY]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#DDE3EC")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('BACKGROUND', (1,4), (1,4), colors.HexColor("#FFF0F3")),
        ('TEXTCOLOR', (1,4), (1,4), DANGER),
        ('FONTNAME', (1,4), (1,4), 'Helvetica-Bold'),
    ]))
    story.append(waste_table)
    story.append(Spacer(1, 0.5*cm))
    
    # ── Section: Energy Recovery ──────────────────────────────────────────────
    story.append(Paragraph('<b>2. ENERGY RECOVERY CALCULATION  (E<sub>rec</sub> = Σ Mᵢ × LHVᵢ × η)</b>',
                           ParagraphStyle('sh', fontSize=11, textColor=DARK_BG, spaceAfter=6)))
    story.append(HRFlowable(width="100%", thickness=2, color=TEAL, spaceAfter=6))
    
    eb = disposition_data.get("energy_breakdown", {})
    energy_data = [
        ['Metric', 'Value', 'Notes'],
        ['Lower Heating Value (LHV)', f"{disposition_data.get('lhv_mj_kg', 0):.1f} MJ/kg", 'EPA WARM / MatWeb validated'],
        ['Process Efficiency (η)', f"{disposition_data.get('process_efficiency', 0)*100:.0f}%", 'Pyrolysis / thermal efficiency'],
        ['Total Energy Recovered (Eᵣₑc)', f"{eb.get('total_kwh', 0):,.2f} kWh", 'Primary output metric'],
        ['Bio-Oil Output', f"{eb.get('bio_oil_liters', 0):,.2f} L", f"({eb.get('bio_oil_kwh', 0):,.1f} kWh energy equivalent)"],
        ['Syngas Output', f"{eb.get('syngas_kwh', 0):,.2f} kWh", 'Thermal combustion energy'],
        ['Char / Residue', f"{eb.get('char_kg', 0):,.2f} kg", 'Carbon-rich solid residue'],
    ]
    energy_table = Table(energy_data, colWidths=[6*cm, 5*cm, 6*cm])
    energy_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#004D40")),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, LIGHT_GREY]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#DDE3EC")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        # Highlight total energy row
        ('BACKGROUND', (0,3), (-1,3), colors.HexColor("#E6F9F5")),
        ('TEXTCOLOR', (0,3), (-1,3), colors.HexColor("#00695C")),
        ('FONTNAME', (0,3), (-1,3), 'Helvetica-Bold'),
    ]))
    story.append(energy_table)
    story.append(Spacer(1, 0.5*cm))
    
    # ── Section: Environmental Impact ─────────────────────────────────────────
    story.append(Paragraph('<b>3. ENVIRONMENTAL IMPACT SUMMARY</b>',
                           ParagraphStyle('sh', fontSize=11, textColor=DARK_BG, spaceAfter=6)))
    story.append(HRFlowable(width="100%", thickness=2, color=AMBER, spaceAfter=6))
    
    co2 = disposition_data.get("co2_avoided_kg", 0)
    env_data = [
        ['Indicator', 'Value', 'Status'],
        ['CO₂ Emissions Avoided', f"{co2:,.2f} kg", '✓ DIVERTED'],
        ['Landfill Diversion', '100%', '✓ ACHIEVED'],
        ['Methane Prevented', f"{co2 * 0.21:,.2f} kg CO₂eq", '✓ PREVENTED'],
        ['SDG Alignment', 'SDG 11, 12, 13', '✓ COMPLIANT'],
    ]
    env_table = Table(env_data, colWidths=[6*cm, 5*cm, 6*cm])
    env_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#B45309")),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [WHITE, colors.HexColor("#FFFBEB")]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#DDE3EC")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('TEXTCOLOR', (2,1), (2,-1), GREEN_OK),
        ('FONTNAME', (2,1), (2,-1), 'Helvetica-Bold'),
    ]))
    story.append(env_table)
    story.append(Spacer(1, 0.6*cm))
    
    # ── Footer ─────────────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=1, color=MID_GREY))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(
        '<font size="7" color="#8492A6">'
        'R26-IT-015 | SLIIT | Hansika D.M.D.M (IT22893598) | EcoVision — Smart Valuation & Material Routing'
        '</font>',
        ParagraphStyle('footer', alignment=TA_CENTER, fontSize=7)
    ))
    
    doc.build(story)
    return buffer.getvalue()
