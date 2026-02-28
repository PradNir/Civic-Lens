import React from 'react';

const STATUS_STYLES = {
  Open: { background: '#FEF9C3', border: '#FDE047', color: '#713F12' },
  'In Progress': { background: '#EFF6FF', border: '#BFDBFE', color: '#1E40AF' },
  Resolved: { background: '#F0FDF4', border: '#BBF7D0', color: '#14532D' },
};

export default function StatusBadge({ status = 'Open' }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Open;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: `1px solid ${style.border}`,
        background: style.background,
        color: style.color,
        borderRadius: 999,
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {status}
    </span>
  );
}
