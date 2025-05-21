# Simple-WAF

A simple Web Application Firewall (WAF) built in Node.js using Express and TypeScript to filter suspicious requests.
It also serves a frontend React application built with Vite.

---

## 📁 Project Structure

```
Simple-WAF/
├── client/            # Vite + React frontend
│   ├── src/
│   └── dist/          # Production build (after `npm run build`)
├── server/            # Express server with WAF middleware
│   ├── index.ts
│   └── wafMiddleware.ts
|   └── package.json
|   └── tsconfig.json
└── README.md
```

---

## 🚀 Features

* ✅ Custom WAF Middleware to block suspicious request patterns
* ✅ Rate Limiting using `express-rate-limit`
* ✅ Serves React frontend (from Vite `dist/` build)
* ✅ Fully written in TypeScript

---

## 🛠️ Project Setup

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/simple-waf.git
cd simple-waf
```

### 2. Install Server Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 🔪 Development Workflow

### 1. Build the React App

```bash
cd client
npm run build
```

This generates the production-ready frontend in `client/dist`.

### 2. Run the Express Server

From the root or `server/` directory:

```bash
npx ts-node server/index.ts
```

Or add a script in `package.json`:

```json
"scripts": {
  "dev": "ts-node server/index.ts"
}
```

Then:

```bash
npm run dev
```

---

## 🌐 Visit the App

* Frontend: `http://localhost:3000`
* API Endpoint: `http://localhost:3000/api/hello`

---

## 🔐 WAF Testing

The WAF middleware blocks suspicious patterns in query params or body:

| Pattern Blocked   | Example                                  |
| ----------------- | ---------------------------------------- |
| `<script>`        | `/api/hello?x=<script>alert(1)</script>` |
| `SELECT ... FROM` | Body: `{ "q": "SELECT * FROM users" }`   |
| `DROP TABLE`      | Body: `{ "q": "DROP TABLE users" }`      |
| `UNION SELECT`    | `/api/hello?q=UNION SELECT password`     |

You’ll receive a `403 Forbidden` error if a request matches any pattern.

---

## 🔒 Rate Limiting

To simulate DoS protection:

* Users are limited to **100 requests per 15 minutes**.
* Exceeding this will return:

```text
Too many requests from this IP, please try again later.
```

---

## 💡 Ideas to Extend

* Load WAF rules from a config file or DB
* Add IP blacklisting
* GeoIP filtering
* Bot detection (based on headers or speed)
* Request logging to a file

---
