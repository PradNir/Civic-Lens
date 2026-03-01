// Civic Lens Admin — added for PickHacks 2026
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../config/api';

export default function AdminModal({ ticket, onClose, onSave, getAdminToken }) {
  const [status, setStatus] = useState(ticket.status || 'Open');
  const [department, setDepartment] = useState(ticket.department || 'Unassigned');
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || 'Unassigned');
  const [internalNote, setInternalNote] = useState(ticket.internalNote || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const token = await getAdminToken();

      const res = await axios.patch(
        `${API_BASE}/api/tickets/${ticket.ticketId}`,
        { status, department, assignedTo, internalNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSave(res.data);
      setToast('Saved');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: '#fff',
          borderRadius: '10px 10px 0 0',
          borderTop: '3px solid #1B6B3A',
          maxHeight: '92vh',
          overflowY: 'auto',
          animation: 'adminSheetUp 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '8px 0 2px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, borderRadius: 4, background: '#D1D5DB' }} />
        </div>

        <div
          style={{
            padding: '8px 14px 12px',
            borderBottom: '1px solid #F3F4F6',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: '#9CA3AF',
                marginBottom: 3,
              }}
            >
              Ref: {ticket.ticketId}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
              {ticket.description}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6B7280',
              fontSize: 16,
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
            }}
          >
            x
          </button>
        </div>

        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              background: '#F3F4F6',
              color: '#374151',
              fontSize: 12,
              lineHeight: 1.5,
              padding: '10px 11px',
            }}
          >
            {ticket.description}
          </div>

          <div
            style={{
              width: '100%',
              height: 90,
              border: '1px dashed #E5E7EB',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#9CA3AF',
              background: '#F3F4F6',
            }}
          >
            Photo preview placeholder
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  marginBottom: 6,
                }}
              >
                Status
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#111827',
                  background: '#F3F4F6',
                  outline: 'none',
                }}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  marginBottom: 6,
                }}
              >
                Department
              </div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#111827',
                  background: '#F3F4F6',
                  outline: 'none',
                }}
              >
                <option>Unassigned</option>
                <option>Public Works</option>
                <option>Rolla Municipal Utilities</option>
                <option>Environmental Services</option>
                <option>Police Department</option>
                <option>Parks & Recreation</option>
                <option>Community Development</option>
              </select>
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                marginBottom: 6,
              }}
            >
              Assign To
            </div>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 11px',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                fontSize: 13,
                color: '#111827',
                background: '#F3F4F6',
                outline: 'none',
              }}
            >
              <option>Unassigned</option>
              <option>Team A</option>
              <option>Team B</option>
              <option>Field Crew</option>
            </select>
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                marginBottom: 6,
              }}
            >
              Internal Note
            </div>
            <textarea
              rows={4}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 11px',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                fontSize: 13,
                color: '#111827',
                background: '#F3F4F6',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {error ? <div style={{ fontSize: 12, color: '#B91C1C' }}>{error}</div> : null}

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: 10,
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex: 2,
                padding: '9px 16px',
                background: '#1B6B3A',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                opacity: saving ? 0.4 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {toast ? (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111827',
            color: '#fff',
            borderRadius: 999,
            padding: '7px 12px',
            fontSize: 12,
            fontWeight: 600,
            zIndex: 1100,
          }}
        >
          {toast}
        </div>
      ) : null}

      <style>{`@keyframes adminSheetUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
