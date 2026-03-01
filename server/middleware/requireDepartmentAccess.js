const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE || 'https://civic-lens-api-v2',
  issuerBaseURL:
    process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-fvy646tcxlwc32uz.us.auth0.com/',
  tokenSigningAlg: 'RS256',
});

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

module.exports = function requireDepartmentAccess(req, res, next) {
  return jwtCheck(req, res, (err) => {
    if (err) {
      return res.status(err.status || 401).json({ error: err.message || 'Unauthorized' });
    }

    const payload = req.auth?.payload || {};
    const roles = payload?.['https://civic-lens/roles'] || [];
    const department = normalizeDepartment(payload?.['https://civic-lens/department'] || '');
    const isAdmin = Array.isArray(roles) && roles.includes('admin');

    if (!isAdmin && !department) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.authContext = { isAdmin, department };
    return next();
  });
};
