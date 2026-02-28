import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const stats = [
  { n: '847', l: 'This week', d: 'Up 12 today' },
  { n: '612', l: 'Fixed / month', d: '72% rate' },
  { n: '14K+', l: 'Total updates', d: '' },
];

const reports = [
  {
    id: 'CVL-4821',
    title: 'Large pothole near crosswalk',
    loc: '123 Main St, Rolla',
    time: '14 mins ago',
    status: 'In Progress',
  },
  {
    id: 'CVL-4820',
    title: 'Streetlight out on Oak Ave',
    loc: '45 Oak Ave, Rolla',
    time: '1 hr ago',
    status: 'Open',
  },
  {
    id: 'CVL-4819',
    title: 'Graffiti behind bus stop',
    loc: '7 Pine Blvd, Rolla',
    time: '3 hrs ago',
    status: 'Resolved',
  },
];

const statusColors = {
  Open: { bg: '#FEF9C3', border: '#FDE047', text: '#713F12', dot: '#EAB308' },
  'In Progress': {
    bg: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1E40AF',
    dot: '#3B82F6',
  },
  Resolved: { bg: '#F0FDF4', border: '#BBF7D0', text: '#14532D', dot: '#22C55E' },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div
        style={{
          background: '#1B6B3A',
          padding: '20px 16px 24px',
          borderBottom: '3px solid #145C30',
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 4,
          }}
        >
          Report, view, or discuss local problems
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 16,
          }}
        >
          Like graffiti, fly tipping, broken paving slabs, or street lighting -
          we send it to the council on your behalf.
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 14,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Enter a nearby street name or postcode
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              placeholder="e.g. 'Main St, Rolla' or 65401"
              style={{
                flex: 1,
                padding: '9px 11px',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              onClick={() => navigate('/report')}
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
              Go
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              color: '#9CA3AF',
            }}
          >
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            or
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>

          <button
            onClick={() => navigate('/report')}
            style={{
              width: '100%',
              padding: '9px 12px',
              background: '#F3F4F6',
              border: '1px dashed #E5E7EB',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              color: '#6B7280',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <span>[Photo]</span> Start a report with a photo
          </button>
        </div>
      </div>

      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            display: 'flex',
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.l}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRight: i < 2 ? '1px solid #E5E7EB' : 'none',
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#111827',
                  letterSpacing: '-0.5px',
                  lineHeight: 1,
                  marginBottom: 3,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#9CA3AF',
                  fontWeight: 600,
                }}
              >
                {s.l}
              </div>
              {s.d && (
                <div
                  style={{
                    fontSize: 11,
                    color: '#16A34A',
                    fontWeight: 500,
                    marginTop: 2,
                  }}
                >
                  {s.d}
                </div>
              )}
            </div>
          ))}
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
              padding: '9px 14px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: '#6B7280',
              }}
            >
              Recently reported
            </span>
            <span
              style={{
                fontSize: 12,
                color: '#1B6B3A',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/track')}
            >
              View all &rarr;
            </span>
          </div>

          {reports.map((r) => {
            const sc = statusColors[r.status];

            return (
              <div
                key={r.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/track?id=${r.id}`)}
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
                    {r.title}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>
                    [Location] {r.loc}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 4,
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{r.time}</span>
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
                      {r.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
