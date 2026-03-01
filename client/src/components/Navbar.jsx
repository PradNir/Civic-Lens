// Civic Lens Admin - updated for PickHacks 2026
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const isAdminUser = user?.['https://civic-lens/roles']?.includes('admin');
  const hasDepartmentAccess = Boolean(user?.['https://civic-lens/department']);
  const isAdminContext = location.pathname.startsWith('/admin');
  const homeTarget = isAdminUser || hasDepartmentAccess || isAdminContext ? '/admin' : '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        background: '#111827',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid #145C30',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      <div
        onClick={() => navigate(homeTarget)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          CL
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
          Civic Lens
        </div>
        <span
          style={{
            background: 'transparent',
            borderTop: '1px solid rgba(255,255,255,0.25)',
            borderRight: '1px solid rgba(255,255,255,0.25)',
            borderBottom: '1px solid rgba(255,255,255,0.25)',
            borderLeft: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            padding: '3px 8px',
            cursor: 'default',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderTopColor = 'rgba(255,255,255,0.5)';
            e.currentTarget.style.borderRightColor = 'rgba(255,255,255,0.5)';
            e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.5)';
            e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.5)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderTopColor = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.borderRightColor = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
          }}
        >
          📍 Rolla, MO
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => navigate(homeTarget)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '5px 9px',
            borderRadius: 4,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        >
          Home
        </button>
        <button
          onClick={() => navigate('/track')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            padding: '5px 9px',
            borderRadius: 4,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        >
          My Reports
        </button>
        {isAdminUser ? (
          <button
            onClick={() => window.open('/admin', '_blank', 'noopener,noreferrer')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.75)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '5px 9px',
              borderRadius: 4,
            }}
          >
            Admin
          </button>
        ) : null}

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{user.name}</span>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: 4,
              }}
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: 4,
            }}
          >
            Sign in
          </button>
        )}
        {!isAdminUser ? (
          <button
            onClick={() => navigate('/admin/login')}
            style={{
              background: 'none',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              paddingLeft: 16,
              paddingRight: 9,
              paddingTop: 5,
              paddingBottom: 5,
              borderRadius: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >
            Dept Login
          </button>
        ) : null}
      </div>
    </nav>
  );
}
