<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>R26-IT-015 — E-Waste Forecasting System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0d0f12;
    --bg2:       #131619;
    --bg3:       #1a1e23;
    --bg4:       #22272e;
    --border:    rgba(255,255,255,0.07);
    --border2:   rgba(255,255,255,0.12);
    --ink:       #e8eaed;
    --ink2:      #8b9099;
    --ink3:      #50565f;
    --accent:    #1fc98e;
    --accent2:   #0a7a55;
    --accent-bg: rgba(31,201,142,0.08);
    --coral:     #e07a5f;
    --coral-bg:  rgba(224,122,95,0.08);
    --amber:     #f2a93b;
    --amber-bg:  rgba(242,169,59,0.08);
    --blue:      #5b9cf6;
    --blue-bg:   rgba(91,156,246,0.08);
    --f-head: 'Syne', sans-serif;
    --f-body: 'DM Sans', sans-serif;
    --f-mono: 'IBM Plex Mono', monospace;
    --r-sm: 6px;
    --r-md: 10px;
    --r-lg: 14px;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--f-body);
    background: var(--bg);
    color: var(--ink);
    line-height: 1.7;
    min-height: 100vh;
  }

  /* ── LAYOUT ─────────────────────────────── */
  .container {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 2rem 5rem;
  }

  /* ── TOPBAR ──────────────────────────────── */
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 2rem;
    border-bottom: 0.5px solid var(--border);
    max-width: 860px;
    margin: 0 auto;
  }
  .topbar-id {
    font-family: var(--f-mono);
    font-size: 11px;
    color: var(--ink3);
    letter-spacing: 0.12em;
  }
  .topbar-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--f-mono);
    font-size: 11px;
    color: var(--accent);
  }
  .topbar-status::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* ── HERO ────────────────────────────────── */
  .hero {
    padding: 4rem 0 3rem;
    border-bottom: 0.5px solid var(--border);
  }
  .hero-eyebrow {
    font-family: var(--f-mono);
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .hero-eyebrow::before {
    content: '';
    display: inline-block;
    width: 24px; height: 1px;
    background: var(--accent);
  }
  .hero-title {
    font-family: var(--f-head);
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 1rem;
  }
  .hero-title span { color: var(--accent); }
  .hero-sub {
    font-size: 15px;
    color: var(--ink2);
    font-weight: 300;
    max-width: 520px;
    line-height: 1.7;
    margin-bottom: 2rem;
  }
  .hero-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .pill {
    font-family: var(--f-mono);
    font-size: 11px;
    padding: 5px 13px;
    border-radius: 100px;
    border: 0.5px solid var(--border2);
    color: var(--ink2);
    background: var(--bg2);
  }
  .pill-green {
    background: var(--accent-bg);
    border-color: rgba(31,201,142,0.3);
    color: var(--accent);
  }

  /* ── SECTION ──────────────────────────────── */
  .section { padding: 3rem 0 0; }
  .sec-label {
    font-family: var(--f-mono);
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sec-label::after {
    content: '';
    flex: 1;
    height: 0.5px;
    background: var(--border);
  }

  /* ── OBJECTIVE GRID ──────────────────────── */
  .obj-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px;
  }
  .obj-card {
    background: var(--bg2);
    border: 0.5px solid var(--border);
    border-radius: var(--r-md);
    padding: 1.125rem;
    transition: border-color 0.2s, background 0.2s;
  }
  .obj-card:hover {
    border-color: var(--border2);
    background: var(--bg3);
  }
  .obj-num {
    font-family: var(--f-mono);
    font-size: 10px;
    color: var(--accent);
    margin-bottom: 8px;
    letter-spacing: 0.06em;
  }
  .obj-text {
    font-size: 13px;
    color: var(--ink2);
    line-height: 1.55;
  }

  /* ── DATASET TABLE ───────────────────────── */
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .data-table thead tr {
    border-bottom: 0.5px solid var(--border2);
  }
  .data-table th {
    font-family: var(--f-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink3);
    font-weight: 400;
    padding: 0 16px 10px 0;
    text-align: left;
  }
  .data-table td {
    padding: 12px 16px 12px 0;
    border-bottom: 0.5px solid var(--border);
    color: var(--ink2);
    vertical-align: middle;
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table td:first-child { color: var(--ink); font-weight: 500; }
  .tag {
    font-family: var(--f-mono);
    font-size: 10px;
    padding: 3px 9px;
    border-radius: var(--r-sm);
    border: 0.5px solid var(--border2);
    color: var(--ink3);
    background: var(--bg3);
  }
  .role-tag {
    font-family: var(--f-mono);
    font-size: 10px;
    color: var(--ink3);
  }

  /* ── PIPELINE ────────────────────────────── */
  .pipeline { display: flex; flex-direction: column; }
  .pipe-step {
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 0 20px;
    position: relative;
  }
  .pipe-step + .pipe-step { margin-top: 0; }
  .pipe-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .pipe-num {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: var(--bg3);
    border: 0.5px solid var(--border2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--f-mono);
    font-size: 11px;
    color: var(--accent);
    font-weight: 500;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  .pipe-line {
    flex: 1;
    width: 0.5px;
    background: var(--border);
    margin: 4px 0;
    min-height: 20px;
  }
  .pipe-body { padding: 0.5rem 0 2rem; }
  .pipe-title {
    font-family: var(--f-head);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
    color: var(--ink);
  }
  .pipe-desc {
    font-size: 13px;
    color: var(--ink2);
    line-height: 1.65;
  }
  code {
    font-family: var(--f-mono);
    font-size: 11.5px;
    background: var(--bg4);
    border: 0.5px solid var(--border);
    padding: 1px 6px;
    border-radius: 4px;
    color: var(--amber);
  }
  .pipe-badge {
    display: inline-block;
    font-family: var(--f-mono);
    font-size: 10px;
    padding: 3px 9px;
    border-radius: 4px;
    background: var(--accent-bg);
    border: 0.5px solid rgba(31,201,142,0.25);
    color: var(--accent);
    margin-top: 8px;
  }

  /* ── FEATURE GRID ────────────────────────── */
  .feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .feat-card {
    border: 0.5px solid var(--border);
    border-radius: var(--r-md);
    padding: 1.125rem;
    background: var(--bg2);
  }
  .feat-label {
    font-family: var(--f-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink3);
    margin-bottom: 12px;
  }
  .feat-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--ink2);
    padding: 7px 0;
    border-bottom: 0.5px solid var(--border);
  }
  .feat-item:last-child { border-bottom: none; }
  .dot-x { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .dot-y { width: 7px; height: 7px; border-radius: 50%; background: var(--coral); flex-shrink: 0; }

  /* ── SAMPLE DATA ─────────────────────────── */
  .terminal {
    background: #0a0c0e;
    border: 0.5px solid var(--border2);
    border-radius: var(--r-lg);
    overflow: hidden;
    font-family: var(--f-mono);
  }
  .terminal-bar {
    padding: 10px 16px;
    border-bottom: 0.5px solid var(--border);
    display: flex;
    align-items: center;
    gap: 7px;
    background: #0d0f11;
  }
  .t-dot { width: 10px; height: 10px; border-radius: 50%; }
  .t-red   { background: #ff5f57; }
  .t-amber { background: #febc2e; }
  .t-green { background: #28c840; }
  .t-filename {
    font-size: 11px;
    color: var(--ink3);
    margin-left: 8px;
  }
  .t-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .t-table th {
    padding: 10px 20px;
    text-align: right;
    color: var(--ink3);
    font-weight: 400;
    font-size: 11px;
    letter-spacing: 0.06em;
    border-bottom: 0.5px solid var(--border);
  }
  .t-table th:first-child { text-align: left; }
  .t-table td {
    padding: 9px 20px;
    text-align: right;
    color: var(--ink2);
    border-bottom: 0.5px solid var(--border);
    font-size: 12px;
  }
  .t-table td:first-child { text-align: left; color: var(--accent); }
  .t-table tr:last-child td { border-bottom: none; color: var(--ink3); }

  /* ── CHALLENGES ──────────────────────────── */
  .ch-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .ch-card {
    border: 0.5px solid var(--border);
    border-radius: var(--r-md);
    padding: 1.125rem;
    background: var(--bg2);
    transition: border-color 0.2s;
  }
  .ch-card:hover { border-color: var(--border2); }
  .ch-id {
    font-family: var(--f-mono);
    font-size: 10px;
    color: var(--ink3);
    margin-bottom: 6px;
    letter-spacing: 0.08em;
  }
  .ch-title { font-size: 13px; font-weight: 500; margin-bottom: 8px; color: var(--ink); }
  .ch-sol {
    font-family: var(--f-mono);
    font-size: 11px;
    color: var(--accent);
    padding-top: 8px;
    border-top: 0.5px solid var(--border);
    line-height: 1.55;
  }

  /* ── STATUS ──────────────────────────────── */
  .status-list { display: flex; flex-direction: column; gap: 10px; }
  .status-row { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--ink2); }
  .chk {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--accent-bg);
    border: 0.5px solid rgba(31,201,142,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .chk::after {
    content: '';
    width: 5px; height: 8px;
    border: 1.5px solid var(--accent);
    border-top: none; border-left: none;
    transform: rotate(42deg) translate(-1px,-1px);
    display: block;
  }

  /* ── NEXT STEPS ──────────────────────────── */
  .next-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(165px, 1fr)); gap: 10px; }
  .next-card {
    border: 0.5px solid var(--border);
    border-radius: var(--r-md);
    padding: 1rem;
    background: var(--bg2);
    transition: border-color 0.2s, background 0.2s;
  }
  .next-card:hover { border-color: var(--border2); background: var(--bg3); }
  .next-idx {
    font-family: var(--f-mono);
    font-size: 10px;
    color: var(--accent);
    margin-bottom: 7px;
    letter-spacing: 0.06em;
  }
  .next-text { font-size: 13px; color: var(--ink2); line-height: 1.45; }

  /* ── TECH STACK ──────────────────────────── */
  .tech-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .tech-badge {
    font-family: var(--f-mono);
    font-size: 12px;
    padding: 7px 16px;
    border-radius: var(--r-sm);
    border: 0.5px solid var(--border);
    color: var(--ink2);
    background: var(--bg2);
    transition: border-color 0.2s, color 0.2s;
  }
  .tech-badge:hover { border-color: var(--border2); color: var(--ink); }

  /* ── PROJECT STRUCTURE ───────────────────── */
  .tree {
    background: #0a0c0e;
    border: 0.5px solid var(--border);
    border-radius: var(--r-md);
    padding: 1.25rem 1.5rem;
    font-family: var(--f-mono);
    font-size: 12.5px;
    line-height: 2;
    color: var(--ink3);
  }
  .tree .dir { color: var(--blue); }
  .tree .file { color: var(--ink2); }
  .tree .comment { color: var(--ink3); font-style: italic; }

  /* ── FOOTER ──────────────────────────────── */
  .footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 0.5px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
  }
  .footer-author { font-size: 13px; color: var(--ink2); }
  .footer-author strong { color: var(--ink); font-weight: 500; }
  .footer-note {
    font-family: var(--f-mono);
    font-size: 10px;
    color: var(--ink3);
    text-align: right;
    max-width: 300px;
    line-height: 1.7;
  }

  /* ── DIVIDER ─────────────────────────────── */
  .div { height: 0.5px; background: var(--border); margin: 3rem 0 0; }

  /* ── RESPONSIVE ──────────────────────────── */
  @media (max-width: 600px) {
    .feat-grid, .ch-grid { grid-template-columns: 1fr; }
    .hero-title { font-size: 26px; }
    .topbar { flex-direction: column; gap: 8px; align-items: flex-start; }
  }
</style>
</head>
<body>

<!-- TOPBAR -->
<div class="topbar">
  <span class="topbar-id">R26-IT-015 · Data Engineering Module</span>
  <span class="topbar-status">Pipeline Complete</span>
</div>

<div class="container">

  <!-- HERO -->
  <div class="hero">
    <div class="hero-eyebrow">E-Waste Forecasting System</div>
    <h1 class="hero-title">Data Pipeline<br>&amp; <span>Preprocessing</span></h1>
    <p class="hero-sub">Transforms raw, heterogeneous datasets into a clean, unified ML-ready structure for time-series forecasting of e-waste generation.</p>
    <div class="hero-pills">
      <span class="pill pill-green">✔ Pipeline Complete</span>
      <span class="pill">Python 3</span>
      <span class="pill">Pandas · NumPy · Scikit-learn</span>
      <span class="pill">Jupyter Notebook</span>
    </div>
  </div>

  <!-- OBJECTIVE -->
  <div class="section">
    <div class="sec-label">Objectives</div>
    <div class="obj-grid">
      <div class="obj-card">
        <div class="obj-num">01 — Collect</div>
        <div class="obj-text">Gather real-world GDP, ICT Imports, and E-waste datasets from World Bank and Kaggle.</div>
      </div>
      <div class="obj-card">
        <div class="obj-num">02 — Clean</div>
        <div class="obj-text">Remove inconsistencies, filter relevant countries, and handle missing values.</div>
      </div>
      <div class="obj-card">
        <div class="obj-num">03 — Align</div>
        <div class="obj-text">Merge all sources into a unified structure on matching country and time range.</div>
      </div>
      <div class="obj-card">
        <div class="obj-num">04 — Prepare</div>
        <div class="obj-text">Scale and structure features into an ML-ready format for LSTM training.</div>
      </div>
    </div>
  </div>

  <!-- DATASETS -->
  <div class="section">
    <div class="sec-label">Datasets</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Dataset</th>
          <th>Source</th>
          <th>Description</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>GDP per capita</td>
          <td><span class="tag">World Bank</span></td>
          <td>Economic indicator</td>
          <td><span class="role-tag">Feature X₁</span></td>
        </tr>
        <tr>
          <td>Imports (ICT goods %)</td>
          <td><span class="tag">World Bank</span></td>
          <td>Electronic consumption proxy</td>
          <td><span class="role-tag">Feature X₂</span></td>
        </tr>
        <tr>
          <td>E-waste generation</td>
          <td><span class="tag">Kaggle</span></td>
          <td>E-waste output in metric tons</td>
          <td><span class="role-tag">Target y</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PIPELINE -->
  <div class="section">
    <div class="sec-label">Processing Pipeline</div>
    <div class="pipeline">

      <div class="pipe-step">
        <div class="pipe-left">
          <div class="pipe-num">01</div>
          <div class="pipe-line"></div>
        </div>
        <div class="pipe-body">
          <div class="pipe-title">Data Loading</div>
          <div class="pipe-desc">Imported CSV datasets. Used <code>skiprows=4</code> to bypass World Bank metadata headers embedded at the top of each file.</div>
        </div>
      </div>

      <div class="pipe-step">
        <div class="pipe-left">
          <div class="pipe-num">02</div>
          <div class="pipe-line"></div>
        </div>
        <div class="pipe-body">
          <div class="pipe-title">Data Cleaning</div>
          <div class="pipe-desc">Filtered to the relevant country (Sri Lanka — simulated). Dropped extraneous columns and resolved null entries across all datasets.</div>
        </div>
      </div>

      <div class="pipe-step">
        <div class="pipe-left">
          <div class="pipe-num">03</div>
          <div class="pipe-line"></div>
        </div>
        <div class="pipe-body">
          <div class="pipe-title">Wide → Long Transformation</div>
          <div class="pipe-desc">Reshaped World Bank wide-format tables using <code>melt()</code>. Standardized all column schemas to <code>Country | Year | Value</code>.</div>
          <span class="pipe-badge">pandas.melt()</span>
        </div>
      </div>

      <div class="pipe-step">
        <div class="pipe-left">
          <div class="pipe-num">04</div>
          <div class="pipe-line"></div>
        </div>
        <div class="pipe-body">
          <div class="pipe-title">Alignment &amp; Merging</div>
          <div class="pipe-desc">Joined all three sources on matching country and overlapping time range into a single unified dataframe with columns <code>Country | Year | GDP | Imports | E_waste_MT</code>.</div>
        </div>
      </div>

      <div class="pipe-step">
        <div class="pipe-left">
          <div class="pipe-num">05</div>
          <div class="pipe-line"></div>
        </div>
        <div class="pipe-body">
          <div class="pipe-title">Gap Handling</div>
          <div class="pipe-desc">Identified missing time steps in the series. Applied forward fill to propagate last known values and maintain temporal continuity for model training.</div>
          <span class="pipe-badge">ffill()</span>
        </div>
      </div>

      <div class="pipe-step">
        <div class="pipe-left">
          <div class="pipe-num">06</div>
        </div>
        <div class="pipe-body">
          <div class="pipe-title">Feature Scaling</div>
          <div class="pipe-desc">Applied <code>MinMaxScaler</code> to normalize all features into the [0, 1] range — preventing large-magnitude values from dominating the loss surface and improving LSTM convergence.</div>
          <span class="pipe-badge">MinMaxScaler</span>
        </div>
      </div>

    </div>
  </div>

  <!-- FEATURES -->
  <div class="section">
    <div class="sec-label">Feature Set</div>
    <div class="feat-grid">
      <div class="feat-card">
        <div class="feat-label">Input features — X</div>
        <div class="feat-item"><span class="dot-x"></span>GDP per capita</div>
        <div class="feat-item"><span class="dot-x"></span>Imports (ICT goods %)</div>
      </div>
      <div class="feat-card">
        <div class="feat-label">Target variable — y</div>
        <div class="feat-item"><span class="dot-y"></span>E_waste_MT (metric tons)</div>
      </div>
    </div>
  </div>

  <!-- SAMPLE DATA -->
  <div class="section">
    <div class="sec-label">Final Dataset Sample</div>
    <div class="terminal">
      <div class="terminal-bar">
        <div class="t-dot t-red"></div>
        <div class="t-dot t-amber"></div>
        <div class="t-dot t-green"></div>
        <span class="t-filename">unified_dataset.csv</span>
      </div>
      <table class="t-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>GDP</th>
            <th>Imports</th>
            <th>E_waste_MT</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>2015</td><td>4,057</td><td>4.22</td><td>4,100,000</td></tr>
          <tr><td>2016</td><td>4,149</td><td>4.95</td><td>4,370,000</td></tr>
          <tr><td>2017</td><td>4,385</td><td>5.11</td><td>4,590,000</td></tr>
          <tr><td>2018</td><td>4,501</td><td>5.44</td><td>4,820,000</td></tr>
          <tr><td>...</td><td>...</td><td>...</td><td>...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- PROJECT STRUCTURE -->
  <div class="section">
    <div class="sec-label">Project Structure</div>
    <div class="tree">
      <span class="dir">ml/</span><br>
      &nbsp;&nbsp;├── <span class="dir">data/</span><br>
      &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├── <span class="dir">raw/</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment"># Original datasets</span><br>
      &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└── <span class="dir">processed/</span>&nbsp;<span class="comment"># Cleaned datasets</span><br>
      &nbsp;&nbsp;├── <span class="dir">notebooks/</span><br>
      &nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└── <span class="file">01_data_check.ipynb</span>&nbsp;<span class="comment"># Processing workflow</span><br>
      &nbsp;&nbsp;└── <span class="dir">venv/</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment"># Virtual environment</span>
    </div>
  </div>

  <!-- CHALLENGES -->
  <div class="section">
    <div class="sec-label">Challenges &amp; Solutions</div>
    <div class="ch-grid">
      <div class="ch-card">
        <div class="ch-id">C-01</div>
        <div class="ch-title">Wide-format World Bank data</div>
        <div class="ch-sol">→ skiprows=4 + pandas melt() reshape</div>
      </div>
      <div class="ch-card">
        <div class="ch-id">C-02</div>
        <div class="ch-title">Missing time-series values</div>
        <div class="ch-sol">→ Forward fill (ffill) for continuity</div>
      </div>
      <div class="ch-card">
        <div class="ch-id">C-03</div>
        <div class="ch-title">Cross-source inconsistency</div>
        <div class="ch-sol">→ Country + year alignment join</div>
      </div>
      <div class="ch-card">
        <div class="ch-id">C-04</div>
        <div class="ch-title">No Sri Lanka e-waste data</div>
        <div class="ch-sol">→ Simulated consistent country data</div>
      </div>
    </div>
  </div>

  <!-- STATUS -->
  <div class="section">
    <div class="sec-label">Current Status</div>
    <div class="status-list">
      <div class="status-row"><div class="chk"></div>Data pipeline completed</div>
      <div class="status-row"><div class="chk"></div>Dataset cleaned and structured</div>
      <div class="status-row"><div class="chk"></div>Ready for model training</div>
    </div>
  </div>

  <!-- NEXT STEPS -->
  <div class="section">
    <div class="sec-label">Next Steps</div>
    <div class="next-grid">
      <div class="next-card">
        <div class="next-idx">→ 01</div>
        <div class="next-text">Train baseline model</div>
      </div>
      <div class="next-card">
        <div class="next-idx">→ 02</div>
        <div class="next-text">Implement LSTM architecture</div>
      </div>
      <div class="next-card">
        <div class="next-idx">→ 03</div>
        <div class="next-text">Add lag feature engineering</div>
      </div>
      <div class="next-card">
        <div class="next-idx">→ 04</div>
        <div class="next-text">Evaluate model performance</div>
      </div>
    </div>
  </div>

  <!-- TECH STACK -->
  <div class="section">
    <div class="sec-label">Tech Stack</div>
    <div class="tech-row">
      <span class="tech-badge">Python 3</span>
      <span class="tech-badge">Pandas</span>
      <span class="tech-badge">NumPy</span>
      <span class="tech-badge">Scikit-learn</span>
      <span class="tech-badge">Jupyter Notebook</span>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-author">Author — <strong>Sanjula Madushanka</strong></div>
    <div class="footer-note">Module focus: data engineering &amp; preprocessing — the foundation layer for the full e-waste forecasting system.</div>
  </div>

</div><!-- /container -->
</body>
</html>
