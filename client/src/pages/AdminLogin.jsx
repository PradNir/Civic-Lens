// Civic Lens Admin — updated for PickHacks 2026
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './home';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const roles = user?.['https://civic-lens/roles'] || [];
  const hasAdminRole = Array.isArray(roles) && roles.includes('admin');
  const hasDepartmentClaim = Boolean(user?.['https://civic-lens/department']);
  const hasDepartmentAccess = hasAdminRole || hasDepartmentClaim;

  useEffect(() => {
    if (isAuthenticated && hasDepartmentAccess) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, hasDepartmentAccess, navigate]);

  return (
    <div style={{ position: 'relative' }}>
      <Home />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 14,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: '100%',
            maxWidth: 420,
            position: 'relative',
            animation: 'adminSheetUp 0.2s ease-out',
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'none',
              border: 'none',
              color: '#6B7280',
              fontSize: 14,
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
            }}
          >
            ✕
          </button>

          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
            }}
          >
            Department Login
          </div>

          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Welcome back</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
            Sign in to manage and resolve reported issues
          </div>

          <button
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                  scope: 'openid profile email offline_access',
                  prompt: 'login consent',
                },
                appState: { returnTo: '/admin' },
              })
            }
            style={{
              width: '100%',
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
            Sign in with Auth0
          </button>

          <div style={{ fontSize: 11, color: '#9CA3AF' }}>
            Citizens don't need to sign in - just report an issue above
          </div>
          {isAuthenticated && !hasDepartmentAccess ? (
            <div style={{ fontSize: 11, color: '#B91C1C' }}>
              Current account has no department/admin access. Sign in with a department account.
            </div>
          ) : null}
        </div>
      </div>

      <style>{`@keyframes adminSheetUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
