/**
 * pdfExport.js — Bulletproof jsPDF implementation for Vite + React
 * Uses dynamic import to avoid SSR/module issues.
 * Exports a colourful, professional A4 PDF of the Tonnage Manifest.
 */

export const exportManifestPDF = async (manifest) => {
  // Dynamic import avoids Vite module resolution issues
  const { default: jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pw  = doc.internal.pageSize.getWidth()   // 210mm
  const ph  = doc.internal.pageSize.getHeight()  // 297mm
  let y     = 0

  const safeText = (str) => (str == null ? '' : String(str))
  const addPage  = () => { doc.addPage(); y = 20 }
  const needRoom = (h = 20) => { if (y + h > ph - 18) addPage() }

  // ── HEADER BAR ────────────────────────────────────────────────────────
  doc.setFillColor(20, 83, 45)
  doc.rect(0, 0, pw, 52, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(255, 255, 255)
  doc.text('END-OF-CYCLE TONNAGE MANIFEST', pw / 2, 17, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(187, 247, 208)
  doc.text(
    'EcoVision — Smart Valuation & Material Routing | R26-IT-015 | SLIIT',
    pw / 2, 25, { align: 'center' }
  )

  // Manifest ID badge
  doc.setFillColor(22, 163, 74)
  doc.roundedRect(pw / 2 - 40, 30, 80, 12, 4, 4, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(`Manifest ID: ${safeText(manifest.manifest_id)}`, pw / 2, 37.5, { align: 'center' })

  y = 60

  // ── META INFO ROW ─────────────────────────────────────────────────────
  doc.setFillColor(240, 253, 244)
  doc.rect(10, y, pw - 20, 26, 'F')
  doc.setDrawColor(187, 247, 208)
  doc.setLineWidth(0.3)
  doc.rect(10, y, pw - 20, 26, 'D')

  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('Facility:', 15, y + 8)
  doc.text('Generated:', 80, y + 8)
  doc.text('Compliance Status:', 148, y + 8)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(safeText(manifest.facility_name), 15, y + 17)
  doc.text(
    manifest.timestamp
      ? new Date(manifest.timestamp).toLocaleString('en-GB')
      : 'N/A',
    80, y + 17
  )
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(22, 163, 74)
  doc.text('✓ ZERO-WASTE ACHIEVED — 100% LANDFILL DIVERTED', 148, y + 17)

  y += 34

  // ── SUMMARY STAT BOXES ────────────────────────────────────────────────
  const stats = [
    {
      label: 'Total Waste Processed',
      value: `${(manifest.weight_kg || 0).toFixed(2)} kg`,
      color: [37, 99, 235], bg: [239, 246, 255]
    },
    {
      label: 'Energy Recovered',
      value: `${(manifest.energy_breakdown?.total_kwh || 0).toFixed(2)} kWh`,
      color: [22, 163, 74], bg: [240, 253, 244]
    },
    {
      label: 'CO\u2082 Avoided',
      value: `${(manifest.co2_avoided_kg || 0).toFixed(2)} kg`,
      color: [234, 88, 12], bg: [255, 247, 237]
    },
    {
      label: 'Landfill Diversion',
      value: `100%`,
      color: [124, 58, 237], bg: [245, 243, 255]
    },
  ]

  const bw = (pw - 20 - 9) / 4
  stats.forEach(({ label, value, color, bg }, i) => {
    const bx = 10 + i * (bw + 3)
    doc.setFillColor(...bg)
    doc.roundedRect(bx, y, bw, 26, 4, 4, 'F')
    doc.setDrawColor(...color)
    doc.setLineWidth(1.0)
    doc.roundedRect(bx, y, bw, 26, 4, 4, 'D')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(...color)
    doc.text(safeText(value), bx + bw / 2, y + 13, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(100, 100, 100)
    doc.text(safeText(label), bx + bw / 2, y + 21, { align: 'center' })
  })

  y += 34

  // ── DIVIDER ───────────────────────────────────────────────────────────
  doc.setDrawColor(187, 247, 208)
  doc.setLineWidth(0.5)
  doc.line(10, y, pw - 10, y)
  y += 7

  // ── MATERIAL TABLE HEADING ────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 118, 55)
  doc.text('MATERIAL DISPOSITION TABLE', 10, y)
  y += 7

  // Table header
  const cols = [
    { label: 'Item ID',        x: 10,  w: 20 },
    { label: 'Material Type',  x: 30,  w: 38 },
    { label: 'Weight (kg)',    x: 68,  w: 22 },
    { label: 'Route',          x: 90,  w: 56 },
    { label: 'Energy (kWh)',   x: 146, w: 26 },
    { label: 'CO\u2082 (kg)', x: 172, w: 25 },
    { label: 'Date',           x: 197, w: 22 },
  ]

  doc.setFillColor(22, 163, 74)
  doc.rect(10, y, pw - 20, 9, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(255, 255, 255)
  cols.forEach(c => doc.text(c.label, c.x + 1, y + 6))
  y += 9

  const items = manifest.items && Array.isArray(manifest.items) ? manifest.items : [
    {
      item_id: manifest.manifest_id,
      material_type: manifest.waste_type,
      weight_kg: manifest.weight_kg,
      disposition_route: manifest.disposition_route,
      energy_produced_kwh: manifest.energy_breakdown?.total_kwh,
      co2_avoided_kg: manifest.co2_avoided_kg,
      timestamp: manifest.timestamp
    }
  ]
  
  items.forEach((item, idx) => {
    needRoom(10)
    const isEven = idx % 2 === 0
    doc.setFillColor(...(isEven ? [255, 255, 255] : [240, 253, 244]))
    doc.rect(10, y, pw - 20, 9, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(30, 30, 30)

    const route = safeText(item.disposition_route)
    const routeShort = route.length > 30 ? route.slice(0, 28) + '…' : route
    const tsDate = item.timestamp
      ? new Date(item.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      : ''

    doc.text(safeText(item.item_id),                             cols[0].x + 1, y + 6)
    doc.text(safeText(item.material_type),                       cols[1].x + 1, y + 6)
    doc.text(Number(item.weight_kg || 0).toFixed(3),             cols[2].x + 1, y + 6)
    doc.text(routeShort,                                         cols[3].x + 1, y + 6)
    doc.setTextColor(161, 98, 7)
    doc.text(Number(item.energy_produced_kwh || 0).toFixed(3),   cols[4].x + 1, y + 6)
    doc.setTextColor(37, 99, 235)
    doc.text(Number(item.co2_avoided_kg || 0).toFixed(3),        cols[5].x + 1, y + 6)
    doc.setTextColor(100, 100, 100)
    doc.text(tsDate,                                             cols[6].x + 1, y + 6)

    y += 9
  })

  y += 6
  needRoom(50)

  // ── ROUTE BREAKDOWN ────────────────────────────────────────────────────
  const routes = manifest.summary?.route_breakdown_kg || {
    [manifest.disposition_route || 'Unknown Route']: manifest.weight_kg || 0
  }
  if (routes && Object.keys(routes).length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(15, 118, 55)
    doc.text('DISPOSITION ROUTE BREAKDOWN', 10, y)
    y += 8

    Object.entries(routes).forEach(([route, kg]) => {
      needRoom(10)
      doc.setFillColor(240, 253, 244)
      doc.rect(10, y, pw - 20, 9, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(30, 30, 30)
      doc.text(`\u2022  ${route}`, 15, y + 6)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(22, 163, 74)
      doc.text(`${Number(kg).toFixed(2)} kg`, pw - 14, y + 6, { align: 'right' })
      y += 10
    })
  }

  // ── FOOTER on every page ──────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    doc.setFillColor(20, 83, 45)
    doc.rect(0, ph - 13, pw, 13, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(187, 247, 208)
    doc.text(
      'R26-IT-015 | SLIIT | Hansika D.M.D.M (IT22893598) | EcoVision — Smart Valuation & Material Routing',
      pw / 2, ph - 5, { align: 'center' }
    )
    doc.setTextColor(255, 255, 255)
    doc.text(`Page ${p} of ${totalPages}`, pw - 12, ph - 5, { align: 'right' })
  }

  // ── TRIGGER DOWNLOAD ──────────────────────────────────────────────────
  // Use blob URL method for maximum browser compatibility
  const filename = `EcoVision_Manifest_${manifest.manifest_id || 'export'}.pdf`
  const pdfBlob  = doc.output('blob')
  const url      = URL.createObjectURL(pdfBlob)
  const link     = document.createElement('a')
  link.href      = url
  link.download  = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  // Small delay before cleanup to ensure download starts
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 1000)
}
