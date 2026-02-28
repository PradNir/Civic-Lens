import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const CATEGORIES = [
  { id: 'pothole', label: 'Pothole', icon: '[Pothole]' },
  { id: 'streetlight', label: 'Broken Streetlight', icon: '[Light]' },
  { id: 'graffiti', label: 'Graffiti', icon: '[Graffiti]' },
  { id: 'flooding', label: 'Flooding', icon: '[Flood]' },
  { id: 'sidewalk', label: 'Damaged Sidewalk', icon: '[Sidewalk]' },
  { id: 'dumping', label: 'Illegal Dumping', icon: '[Dumping]' },
  { id: 'noise', label: 'Noise Complaint', icon: '[Noise]' },
  { id: 'other', label: 'Other', icon: '[Other]' },
];

export default function SubmitReport() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [aiState, setAiState] = useState('idle');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [descErr, setDescErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [ticket, setTicket] = useState(null);

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setCategory('');
    setAiState('loading');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result?.split(',')[1];
      const mime = file.type;

      if (!base64) {
        setAiState('idle');
        return;
      }

      try {
        const res = await axios.post('https://figure-yields-roles-contributors.trycloudflare.com/api/tickets/classify', {
          imageBase64: base64,
          mimeType: mime,
        });
        setCategory(res.data.category);
        setAiState('done');
      } catch (err) {
        console.error(err);
        setAiState('idle');
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!desc.trim()) {
      setDescErr('Please describe the issue.');
      return;
    }

    setDescErr('');
    setSubmitting(true);

    try {
      const res = await axios.post('https://figure-yields-roles-contributors.trycloudflare.com/api/tickets', {
        description: desc,
        category,
        photoUrl: preview,
        location: '123 Main St, Rolla, MO 65401',
        userId: 'anonymous',
      });

      setTicket(res.data);
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (done && ticket) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              background: '#fff',
              border: '1px solid #BBF7D0',
              borderTop: '3px solid #1B6B3A',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>[OK]</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
              Thank you - report received
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 16, lineHeight: 1.5 }}>
              Your report has been sent to the relevant department. You will receive updates
              as the status changes.
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: '#9CA3AF',
                marginBottom: 6,
              }}
            >
              Your reference number
            </div>
            <div
              style={{
                display: 'inline-block',
                background: '#F0FDF4',
                border: '1.5px solid #1B6B3A',
                borderRadius: 6,
                padding: '7px 20px',
                fontFamily: 'monospace',
                fontSize: 20,
                fontWeight: 700,
                color: '#1B6B3A',
                letterSpacing: 2,
                marginBottom: 16,
              }}
            >
              {ticket.ticketId}
            </div>

            <div
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                overflow: 'hidden',
                marginBottom: 16,
                textAlign: 'left',
              }}
            >
              {[
                { k: 'Category', v: ticket.category },
                { k: 'Status', v: ticket.status },
                { k: 'Department', v: ticket.department },
                { k: 'Submitted', v: 'Just now' },
              ].map((row, i) => (
                <div
                  key={row.k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderBottom: i < 3 ? '1px solid #F3F4F6' : 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      color: '#9CA3AF',
                    }}
                  >
                    {row.k}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                    {row.v}
                  </span>
                </div>
              ))}
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
                Back to home
              </button>
              <button
                onClick={() => navigate(`/track?id=${ticket.ticketId}`)}
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
                Track this report &rarr;
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

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
          {'<- Back'}
        </button>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Report a problem</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
          Fields marked * are required
        </div>
      </div>

      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
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
            Step 1 - Photo
          </div>
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              Attach a photo <span style={{ color: '#DC2626' }}>*</span>
            </div>

            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: '100%',
                height: preview ? 170 : 130,
                border: '1px dashed #E5E7EB',
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                background: '#F3F4F6',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                />
              ) : (
                <>
                  <div style={{ fontSize: 22 }}>[Photo]</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                    Tap to attach a photo
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>JPG or PNG, max 10MB</div>
                </>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhoto}
            />

            <div style={{ fontSize: 11, color: '#9CA3AF' }}>
              A clear photo helps the council resolve issues faster.
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
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
            Step 2 - Category
          </div>

          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {aiState === 'loading' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 10px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#1E40AF',
                }}
              >
                <div
                  style={{
                    width: 13,
                    height: 13,
                    border: '2px solid #BFDBFE',
                    borderTopColor: '#3B82F6',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                    flexShrink: 0,
                  }}
                />
                Gemini AI is analyzing your photo...
              </div>
            )}

            {aiState === 'done' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 10px',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#1B6B3A',
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#1B6B3A',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  OK
                </div>
                AI detected: <strong style={{ marginLeft: 4 }}>{category}</strong> - you can change
                this below
              </div>
            )}

            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              Issue type <span style={{ color: '#DC2626' }}>*</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {CATEGORIES.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCategory(c.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 11px',
                    border: `1px solid ${category === c.label ? '#1B6B3A' : '#E5E7EB'}`,
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: category === c.label ? '#F0FDF4' : '#F3F4F6',
                    fontSize: 13,
                    color: category === c.label ? '#1B6B3A' : '#374151',
                    fontWeight: category === c.label ? 600 : 500,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: `2px solid ${category === c.label ? '#1B6B3A' : '#D1D5DB'}`,
                      background: category === c.label ? '#1B6B3A' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {category === c.label && (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#fff',
                        }}
                      />
                    )}
                  </div>
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
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
            Step 3 - Details
          </div>

          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                Location
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '9px 11px',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#1B6B3A',
                  fontWeight: 500,
                }}
              >
                <span>[Location]</span>
                <span>123 Main St, Rolla, MO 65401 | Auto-detected</span>
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
                Describe the problem <span style={{ color: '#DC2626' }}>*</span>
              </div>

              <textarea
                rows={4}
                placeholder="What's wrong? Include size, danger level, or how long it's been there..."
                value={desc}
                onChange={(e) => {
                  setDesc(e.target.value);
                  if (descErr) setDescErr('');
                }}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: `1px solid ${descErr ? '#DC2626' : '#E5E7EB'}`,
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#111827',
                  background: '#F3F4F6',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
              />

              {descErr && (
                <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 600, marginTop: 4 }}>
                  [Warning] {descErr}
                </div>
              )}
              {!descErr && (
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                  Be specific to help the council respond quickly.
                </div>
              )}
            </div>
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
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!category || !desc.trim() || submitting}
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
              opacity: !category || !desc.trim() || submitting ? 0.4 : 1,
            }}
          >
            {submitting ? 'Submitting...' : 'Submit report ->'}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
