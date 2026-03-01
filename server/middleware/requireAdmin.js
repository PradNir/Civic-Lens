// Civic Lens Admin — added for PickHacks 2026
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
  } catch (err) {
    return null;
  }
}

module.exports = function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = decodeJwtPayload(token);
  const roles = payload?.['https://civic-lens/roles'];

  if (Array.isArray(roles) && roles.includes('admin')) {
    req.user = payload;
    return next();
  }

  return res.status(403).json({ error: 'Forbidden' });
};

