# LabPartner deployment checklist

The repository contains a Node/Express backend in `server/` and a Vite/React frontend in `client/`.

## Backend on Render

1. Set Root Directory to `server`, Build Command to `npm ci`, Start Command to `npm start` (which runs `node server.js`).
2. In Render **Environment**, set `NODE_ENV=production`, `MONGODB_URI` (exact Atlas URI), `JWT_SECRET` (a unique random secret), and `CLIENT_URL` (the frontend origin, e.g. `https://example.com`). Let Render supply `PORT` automatically.
3. Get the Atlas URI from **Database > Clusters > Connect > Drivers**. Use the exact hostname of your running cluster. Replace the database username/password only in Render Environment. Specify a database path, such as `/labpartner`.
4. In Atlas **Network Access**, allow the outbound IP addresses/ranges shown for the Render backend. Avoid unrestricted public access if possible.
5. Save the variables and deploy the service again. Inspect logs for `Connected to MongoDB successfully.` and the server listening message.
6. Visit `https://YOUR-BACKEND.onrender.com/api/health`. HTTP 200 and `"database":"connected"` confirms readiness; HTTP 503 indicates unavailable MongoDB connectivity.

### Known deployment failure

`querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net` is a DNS lookup failure for the configured SRV hostname. `cluster0.mongodb.net` is usually an incomplete example host. Replace the value of `MONGODB_URI` in **Render Environment** with the exact URI copied from Atlas. Also confirm the cluster exists and is running. Do not try to repair this by changing your local laptop IP allowlist; the connection originates from Render.

The backend now explicitly requires `MONGODB_URI` and `JWT_SECRET`, so deployment errors will identify missing configuration without silently falling back to localhost or a shared JWT signing key.

## Frontend

1. On your static frontend host, set Root Directory to `client`, Build Command to `npm ci && npm run build`, Publish Directory to `dist`.
2. Set `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api` in the frontend environment and rebuild. The frontend currently defaults to relative `/api`, which only works if the frontend host proxies `/api` to the backend. The local Vite development proxy is **not** part of the production build.
3. Set Render's `CLIENT_URL` to the exact frontend origin so CORS works.
4. Verify a registration/login request and a profile request in the browser network panel.

Never put database credentials or `JWT_SECRET` in `VITE_*` variables or in the Git repository.
