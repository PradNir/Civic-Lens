// Civic Lens Admin — added for PickHacks 2026
import React from 'react';

const STATUS_COLORS = {
  Open: { bg: '#FEF9C3', border: '#FDE047', text: '#713F12', dot: '#EAB308' },
  'In Progress': { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', dot: '#3B82F6' },
  Resolved: { bg: '#F0FDF4', border: '#BBF7D0', text: '#14532D', dot: '#22C55E' },
};

export default function IssueRow({ ticket, onClick }) {
  const sc = STATUS_COLORS[ticket.status] || STATUS_COLORS.Open;
  const createdAt = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Just now';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderBottom: '1px solid #F3F4F6',
        cursor: 'pointer',
      }}
      onClick={() => onClick(ticket)}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#111827',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {ticket.description}
        </div>
        <div style={{ fontSize: 11, color: '#6B7280' }}>[Location] {ticket.location || 'Unknown'}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>
            {ticket.ticketId} | {createdAt} | {ticket.department || 'Unassigned'} |{' '}
            {ticket.assignedTo || 'Unassigned'}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 7px',
              borderRadius: 3,
              fontSize: 11,
              fontWeight: 700,
              background: sc.bg,
              border: `1px solid ${sc.border}`,
              color: sc.text,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: sc.dot,
                display: 'inline-block',
              }}
            />
            {ticket.status}
          </span>
        </div>
      </div>
    </div>
  );
}

