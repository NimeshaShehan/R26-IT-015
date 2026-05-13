import { useState } from 'react';

/**
 * Hover tooltip for acronyms and abbreviations.
 * Usage: <Tooltip text="Lower Heating Value"><abbr>LHV</abbr></Tooltip>
 */
export default function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);

  return (
    <span
      style={{ position: 'relative', cursor: 'help' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
    >
      {children}
      {show && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-accent)',
          borderRadius: 6,
          padding: '6px 10px',
          fontSize: 11,
          whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow-card)',
          zIndex: 100,
          pointerEvents: 'none',
        }}>
          {text}
        </span>
      )}
    </span>
  );
}
