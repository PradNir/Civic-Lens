import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const STATUS_COLORS = {
  Open: { bg: '#FEF9C3', border: '#FDE047', text: '#713F12', dot: '#EAB308' },
  'In Progress': { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', dot: '#3B82F6' },
  Resolved: { bg: '#F0FDF4', border: '#BBF7D0', text: '#14532D', dot: '#22C55E' },
};

const PRIORITY_COLORS = {
  High: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
  Medium: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
  Low: { bg: '#F8FAFC', border: '#E2E8F0', text: '#475569' },
};

export default function TrackReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('id') || '');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = useCallback(
    async (id) => {
      const searchId = (id || query).trim().toUpperCase();
      if (!searchId) return;

      setLoading(true);
      setSearched(true);
      setError('');
      setTicket(null);

      try {
        const res = await axios.get(`https://figure-yields-roles-contributors.trycloudflare.com/api/tickets/${searchId}`);
        setTicket(res.data);
      } catch (err) {
        setError('Ticket not found. Check your reference number.');
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      handleSearch(idFromUrl);
    }
  }, [searchParams, handleSearch]);

  return (
    <>
      <Navbar />

      <div style={{ background: '#1B6B3A', padding: '12px 16px', borderBottom: '3px solid #145C30' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.8)',
            fontSize: 12,
            cursor: 'pointer',
            padding: 0,
            marginBottom: 6,
          }}
        >
          {'<- Back to home'}
        </button>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Track a report</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
          Enter your reference number to view the latest status
        </div>
      </div>

      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 14 }}>
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
            Reference number
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="e.g. CVL-4821"
              style={{
                flex: 1,
                padding: '9px 11px',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                fontFamily: 'monospace',
                fontSize: 13,
                color: '#111827',
                background: '#F3F4F6',
                outline: 'none',
                letterSpacing: '0.5px',
              }}
            />
            <button
              onClick={() => handleSearch()}
              style={{
                padding: '9px 16px',
                background: '#1B6B3A',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 24, color: '#6B7280', fontSize: 13 }}>
            Searching...
          </div>
        )}

        {searched && !loading && error && (
          <div
            style={{
              background: '#fff',
              border: '1px solid #FECACA',
              borderTop: '3px solid #DC2626',
              borderRadius: 8,
              padding: 16,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#991B1B', marginBottom: 3 }}>
              Report not found
            </div>
            <div style={{ fontSize: 12, color: '#B91C1C' }}>
              Check your reference number - e.g. CVL-4821
            </div>
          </div>
        )}

        {ticket && (() => {
          const sc = STATUS_COLORS[ticket.status] || STATUS_COLORS.Open;
          const pc = PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.Medium;

          return (
            <>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #F3F4F6' }}>
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
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#111827',
                      lineHeight: 1.3,
                      marginBottom: 4,
                    }}
                  >
                    {ticket.description}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>[Location] {ticket.location}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  {[
                    { k: 'Category', v: `${ticket.category}` },
                    { k: 'Status', v: ticket.status, badge: sc },
                    { k: 'Priority', v: ticket.priority, badge: pc },
                    { k: 'Department', v: ticket.department },
                    { k: 'Filed', v: new Date(ticket.createdAt).toLocaleDateString() },
                  ].map((cell, i) => (
                    <div
                      key={cell.k}
                      style={{
                        padding: '10px 14px',
                        borderRight: i % 2 === 0 ? '1px solid #F3F4F6' : 'none',
                        borderBottom: i < 4 ? '1px solid #F3F4F6' : 'none',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          color: '#9CA3AF',
                          marginBottom: 4,
                        }}
                      >
                        {cell.k}
                      </div>
                      {cell.badge ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 7px',
                            borderRadius: 3,
                            fontSize: 11,
                            fontWeight: 700,
                            background: cell.badge.bg,
                            border: `1px solid ${cell.badge.border}`,
                            color: cell.badge.text,
                          }}
                        >
                          {cell.badge.dot && (
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: '50%',
                                background: cell.badge.dot,
                                display: 'inline-block',
                              }}
                            />
                          )}
                          {cell.v}
                        </span>
                      ) : (
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{cell.v}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: '#F0FDF4',
                    borderBottom: '1px solid #BBF7D0',
                    padding: '8px 14px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#1B6B3A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                  }}
                >
                  Progress log
                </div>
                <div style={{ padding: 14 }}>
                  {ticket.log.map((entry, i) => (
                    <div
                      key={`${entry.time}-${i}`}
                      style={{
                        display: 'flex',
                        gap: 10,
                        position: 'relative',
                        paddingBottom: i < ticket.log.length - 1 ? 16 : 0,
                      }}
                    >
                      {i < ticket.log.length - 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            left: 11,
                            top: 24,
                            bottom: 0,
                            width: 2,
                            background: '#BBF7D0',
                          }}
                        />
                      )}
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: '#F0FDF4',
                          border: '2px solid #1B6B3A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 800,
                          color: '#1B6B3A',
                          flexShrink: 0,
                          zIndex: 1,
                        }}
                      >
                        OK
                      </div>
                      <div style={{ flex: 1, paddingTop: 2 }}>
                        <div
                          style={{
                            fontSize: 10,
                            color: '#9CA3AF',
                            fontWeight: 500,
                            marginBottom: 2,
                            fontFamily: 'monospace',
                          }}
                        >
                          {new Date(entry.time).toLocaleString()}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                          {entry.message}
                        </div>
                        {entry.by && (
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
                            by {entry.by}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => navigate('/')}
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
                  {'<- Back'}
                </button>
                <button
                  onClick={() => navigate('/report')}
                  style={{
                    flex: 2,
                    padding: 10,
                    background: '#1B6B3A',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  + Report another issue
                </button>
              </div>
            </>
          );
        })()}
      </div>
    </>
  );
}
