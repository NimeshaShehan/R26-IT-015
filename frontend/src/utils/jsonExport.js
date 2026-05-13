/**
 * jsonExport.js — Bulletproof JSON file download for React/Vite
 * Uses Blob + Object URL for maximum browser compatibility.
 */
export const exportJSON = (data, filename = 'tonnage_manifest.json') => {
  try {
    // Ensure data is serialisable
    const jsonString = JSON.stringify(data, null, 2)
    const blob       = new Blob([jsonString], {
      type: 'application/json;charset=utf-8;'
    })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 1000)
  } catch (err) {
    console.error('JSON export failed:', err)
    // Fallback: open in new tab
    const jsonString = JSON.stringify(data, null, 2)
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(`<pre>${jsonString}</pre>`)
    }
  }
}
