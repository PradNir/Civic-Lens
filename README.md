# Civic Lens

Civic Lens is a full-stack civic issue reporting app.

- Citizens can submit local infrastructure issues with a photo.
- Gemini classifies the issue category from the image.
- Reports are stored in MongoDB and can be tracked by ticket ID.

## Tech Stack

- Client: React (Create React App), React Router, Auth0, Axios
- Server: Node.js, Express, Mongoose, Google Generative AI SDK
- Database: MongoDB Atlas

## Project Structure

```text
civic-lens/
  client/   # React frontend
  server/   # Express API
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas connection string
- Google Gemini API key
- Auth0 app credentials (for frontend sign-in)

## Environment Variables

### `server/.env`

```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
PORT=5000
AUTH0_AUDIENCE=https://civic-lens-api-v2
AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com/
```

### `client/.env`

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AUTH0_DOMAIN=your-auth0-domain
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
REACT_APP_AUTH0_AUDIENCE=https://civic-lens-api-v2
```

## Install

From repo root:

```bash
cd server
npm install

cd ../client
npm install
```

## Run Locally

Start backend:

```bash
cd server
npm start
```

Start frontend (new terminal):

```bash
cd client
npm start
```

App URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Key API Endpoints

- `POST /api/tickets/classify` - classify issue image with Gemini
- `POST /api/tickets` - create ticket
- `GET /api/tickets` - admin/department ticket list (Auth0 token required)
- `PATCH /api/tickets/:id` - update status/assignment/note (Auth0 token required)
- `GET /api/tickets/:id` - fetch ticket by reference ID (e.g. `CVL-4821`)

## Admin / Department Access

- Frontend routes:
  - `/admin/login` -> department/admin sign-in modal
  - `/admin` -> protected dashboard
- Backend enforces JWT verification with Auth0 (`express-oauth2-jwt-bearer`) on protected ticket routes.
- Access logic:
  - `admin` role can view/update across departments.
  - Department users are scoped to their own department.

### Auth0 Setup (Required)

1. Create API in Auth0 with identifier `https://civic-lens-api-v2`.
2. Authorize the `Civic Lens` SPA to use that API.
3. Create role `admin` and assign to admin users.
4. Add a Post Login Action to attach claims to both ID and Access tokens:

```js
exports.onExecutePostLogin = async (event, api) => {
  const roles = event.authorization?.roles || [];
  api.idToken.setCustomClaim('https://civic-lens/roles', roles);
  api.accessToken.setCustomClaim('https://civic-lens/roles', roles);

  const dept = event.user.app_metadata?.department || '';
  if (dept) {
    api.idToken.setCustomClaim('https://civic-lens/department', dept);
    api.accessToken.setCustomClaim('https://civic-lens/department', dept);
  }
};
```

## Build

```bash
cd client
npm run build
```

## Deployment (Vultr + Cloudflare Tunnel)

This project is deployed on Vultr, and Cloudflare Tunnel may be used to expose services during setup/testing.

- Vultr: hosts the backend service.
- Cloudflare Tunnel: optional public tunnel endpoint (often `*.trycloudflare.com`).

### Recommended Production Setup

1. Use a stable API domain in frontend env:

```env
REACT_APP_API_URL=https://api.yourdomain.com
```

2. Do not hardcode temporary tunnel URLs in client code.
3. Keep Cloudflare tunnel URLs for temporary testing only (they can rotate).
4. Restrict backend CORS to your real frontend domain (and optional tunnel domain during testing).

### Example CORS Allowlist (server)

```js
app.use(
  cors({
    origin: [
      'https://your-frontend-domain.com',
      'https://optional-temp-tunnel.trycloudflare.com',
    ],
  })
);
```

## Notes

- `.env` files are gitignored.
- If Gemini classification fails, verify `GEMINI_API_KEY` and `GEMINI_MODEL`.
- If ticket lookup fails, make sure frontend `REACT_APP_API_URL` points to the running backend.
- If using Cloudflare Tunnel, treat it as temporary unless you configure a stable custom domain.

