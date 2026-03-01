// Civic Lens Admin - added for PickHacks 2026
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';
import IssueRow from '../components/IssueRow';
import AdminModal from '../components/AdminModal';
import API_BASE from '../config/api';

const TABS = [
  'All',
  'Open',
  'In Progress',
  'Resolved',
  'Public Works',
  'Rolla Municipal Utilities',
  'Environmental Services',
  'Police Department',
  'Parks & Recreation',
  'Community Development',
];

function normalizeDepartment(rawDepartment) {
  if (typeof rawDepartment !== 'string') return '';
  const normalized = rawDepartment.trim().toLowerCase();
  if (!normalized) return '';

  const map = {
    'public works': 'Public Works',
    'public works department': 'Public Works',
    'rolla municipal utilities': 'Rolla Municipal Utilities',
    'municipal utilities': 'Rolla Municipal Utilities',
    utilities: 'Rolla Municipal Utilities',
    'environmental services': 'Environmental Services',
    'environment services': 'Environmental Services',
    police: 'Police Department',
    'police department': 'Police Department',
    parks: 'Parks & Recreation',
    'parks & recreation': 'Parks & Recreation',
    'parks and recreation': 'Parks & Recreation',
    'community development': 'Community Development',
  };

  return map[normalized] || rawDepartment.trim();
}

function matchesTab(ticket, tab) {
  if (tab === 'All') return true;
  if (tab === 'Open' || tab === 'In Progress' || tab === 'Resolved') return ticket.status === tab;
  return ticket.department === tab;
}

export default function Admin() {
  const navigate = useNavigate();
  const { getAccessTokenSilently, loginWithRedirect, user } = useAuth0();
  const roleList = user?.['https://civic-lens/roles'] || [];
  const isAdminUser = Array.isArray(roleList) && roleList.includes('admin');
  const userDepartment = normalizeDepartment(user?.['https://civic-lens/department'] || '');

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');
  const [selected, setSelected] = useState(null);

  const getToken = useCallback(async () => {
    const params = process.env.REACT_APP_AUTH0_AUDIENCE
      ? {
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'openid profile email offline_access',
          },
        }
      : undefined;
    try {
      return await getAccessTokenSilently(params);
    } catch (err) {
      if (String(err?.message || '').includes('Missing Refresh Token')) {
        await loginWithRedirect({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'openid profile email offline_access',
            prompt: 'consent',
          },
          appState: { returnTo: '/admin' },
        });
        return '';
      }
      throw err;
    }
  }, [getAccessTokenSilently, loginWithRedirect]);

  useEffect(() => {
    let mounted = true;
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError('');
        const token = await getToken();
        if (!token) return;
        let res;
        try {
          res = await axios.get(`${API_BASE}/api/tickets`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (firstErr) {
          if (firstErr?.response?.status !== 404) throw firstErr;
          res = await axios.get(`${API_BASE}/tickets`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        if (!Array.isArray(res.data)) {
          throw new Error('Ticket list endpoint is not returning JSON array data.');
        }

        if (mounted) setTickets(res.data);
      } catch (err) {
        if (!mounted) return;
        if (!err?.response) {
          setError(
            err?.message || 'Failed to load tickets. Check API URL/tunnel and backend status.'
          );
          return;
        }
        setError(err?.response?.data?.error || `Failed to load tickets (${err.response.status})`);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTickets();
    return () => {
      mounted = false;
    };
  }, [getToken]);

  useEffect(() => {
    if (!isAdminUser && userDepartment) {
      setTab(TABS.includes(userDepartment) ? userDepartment : 'All');
    }
  }, [isAdminUser, userDepartment]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (!matchesTab(t, tab)) return false;
      if (!term) return true;
      return (
        String(t.description || '').toLowerCase().includes(term) ||
        String(t.location || '').toLowerCase().includes(term) ||
        String(t.ticketId || '').toLowerCase().includes(term)
      );
    });
  }, [tickets, tab, search]);

  const stats = useMemo(() => {
    const all = tickets.length;
    const open = tickets.filter((t) => t.status === 'Open').length;
    const inProgress = tickets.filter((t) => t.status === 'In Progress').length;
    return [
      { n: String(all), l: 'Total Tickets', d: `${open} open` },
      { n: String(inProgress), l: 'In Progress', d: `${Math.max(all - open, 0)} updated` },
      { n: String(open), l: 'Needs Action', d: '' },
    ];
  }, [tickets]);

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
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          Admin dashboard
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
          Review incoming issues, assign departments, and update ticket statuses.
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
              {s.d ? (
                <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 500, marginTop: 2 }}>
                  {s.d}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8 }}>
          <div
            style={{
              padding: '9px 14px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets"
                style={{
                  padding: '9px 11px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontSize: 13,
                  outline: 'none',
                  minWidth: 170,
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
                + New Issue
              </button>
            </div>
          </div>

          <div style={{ padding: '0 14px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 14 }}>
            {TABS.filter((t) => isAdminUser || !['All', 'Public Works', 'Rolla Municipal Utilities', 'Environmental Services', 'Police Department', 'Parks & Recreation', 'Community Development'].includes(t) || t === userDepartment || ['Open', 'In Progress', 'Resolved'].includes(t)).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t ? '2px solid #1B6B3A' : '2px solid transparent',
                  color: tab === t ? '#1B6B3A' : '#6B7280',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '9px 0 8px',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#9CA3AF', fontSize: 13 }}>Loading...</div>
          ) : null}
          {!loading && error ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#B91C1C', fontSize: 13 }}>{error}</div>
          ) : null}
          {!loading && !error && filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#9CA3AF', fontSize: 13 }}>
              No issues match your filters.
            </div>
          ) : null}

          {!loading && !error && filtered.length > 0 ? (
            <div>
              {filtered.map((ticket) => (
                <IssueRow key={ticket.ticketId} ticket={ticket} onClick={setSelected} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {selected ? (
        <AdminModal
          ticket={selected}
          onClose={() => setSelected(null)}
          getAdminToken={getToken}
          onSave={(updated) => {
            setTickets((prev) => prev.map((t) => (t.ticketId === updated.ticketId ? updated : t)));
            setSelected(updated);
          }}
        />
      ) : null}
    </>
  );
}
