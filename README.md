<div align="center">

<img src="https://img.shields.io/badge/WFX-AI%20ERP%20Platform-6366f1?style=for-the-badge&logo=database&logoColor=white" alt="WFX ERP">

# WFX AI-Native ERP Platform

**A production-ready, AI-powered ERP system built for the modern textile & fashion industry.**

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-FF6B35?style=flat-square&logo=openai&logoColor=white)](https://openrouter.ai)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](#-docker-support)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[🚀 Live Demo (Frontend)](https://wfx-topaz.vercel.app/) · [🔌 Live API (Backend)](https://wfx-ecqx.onrender.com/api) · [📖 API Docs](#api-reference) · [🐛 Report Bug](https://github.com/SunnySingh128/wfx/issues)

</div>

---

## 📸 Preview

| Dashboard | Product Explorer | AI Query |
|:---------:|:----------------:|:--------:|
| Real-time KPIs, Revenue Charts, Supplier Performance | Filterable product catalog with live Supabase data | Natural Language → SQL powered by OpenRouter |

---

## 🌟 Features

### 🗄️ ERP Core Modules
- **📊 Live Dashboard** — Real-time KPIs (revenue, orders, suppliers, buyers), revenue trend charts, supplier performance scores, product category breakdown
- **🧵 Product Explorer** — Full inventory of finished goods with search, sort, category filters, pagination, and live images
- **🤝 Partner Management** — Supplier & buyer database with performance ratings, lead times, and contact details
- **📦 Sales Orders** — Order tracking with status management (pending → shipped → delivered)
- **🧾 Sales Invoices** — Invoice generation and payment status tracking (pending/paid/overdue)
- **📐 Tech Packs** — Detailed garment specifications including fabric, construction, wash instructions

### 🤖 AI-Powered Features
- **💬 Natural Language Query** — Ask questions like *"Show me all denim products under $50"* and the AI converts it to live SQL using OpenRouter
- **🔍 AI Product Search** — Smart product discovery with multi-filter support (fabric, GSM range, color, print, season)
- **🖼️ Visual Image Search** — Upload a garment image to find similar styles by visual similarity score

### ⚡ Platform Highlights
- **Supabase PostgreSQL** — Production cloud database with 3NF schema, automatic triggers, and indexed queries
- **Row-Level Security** — Configurable RLS policies per table
- **Graceful Fallback** — All API calls fall back to in-memory mock data if live database is unavailable
- **Dark Mode** — Full dark/light theme toggle with CSS custom properties
- **Responsive Design** — Mobile-friendly glassmorphism UI

---

## 🏗️ Architecture

```
wfx/
├── backend/                    # Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js     # Supabase client initialization
│   │   │   └── env.js          # Environment variable validation
│   │   ├── controllers/
│   │   │   ├── dashboardController.js   # KPIs & analytics aggregation
│   │   │   ├── productController.js     # Finished goods CRUD + search
│   │   │   ├── partnerController.js     # Suppliers & buyers
│   │   │   ├── aiController.js          # Natural Language → SQL
│   │   │   └── imageController.js       # Visual similarity search
│   │   ├── routes/             # Express route definitions
│   │   ├── middlewares/        # Error handler, request logger
│   │   └── database/
│   │       ├── supabase_migration.sql   # 🌟 Production schema (run this first)
│   │       ├── schema.sql               # Alternative simplified schema
│   │       └── seed.js                  # Database seeder script
│   └── .env.example            # Environment variable template
│
└── frontend/                   # React 19 + Vite SPA
    └── src/
        ├── pages/              # Dashboard, Explorer, Search, Query, ImageSearch
        ├── components/         # ProductCard, FilterPanel, DashboardCard, etc.
        ├── services/
        │   ├── apiClient.js    # Axios client + field normalizer (snake_case → camelCase)
        │   └── mockData.js     # Fallback in-memory dataset
        ├── styles/             # Vanilla CSS design system with CSS variables
        └── constants/          # Filter options, categories, GSM ranges
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Recharts, React Icons, React Router v7 |
| **Backend** | Node.js 22, Express.js, ES Modules |
| **Database** | Supabase PostgreSQL (Cloud) |
| **AI Engine** | OpenRouter API (Gemma, LLaMA, free-tier models) |
| **Styling** | Vanilla CSS, CSS Custom Properties, Glassmorphism |
| **HTTP Client** | Axios with request/response interceptors |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ 
- A [Supabase](https://supabase.com) project (free tier works)
- An [OpenRouter](https://openrouter.ai) API key (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/SunnySingh128/wfx.git
cd wfx
```

### 2. Set Up the Database

1. Open your [Supabase SQL Editor](https://supabase.com/dashboard)
2. Create a **New Query** and paste the full contents of [`backend/src/database/supabase_migration.sql`](backend/src/database/supabase_migration.sql)
3. Click **Run** — this creates all tables, triggers, indexes, and RLS policies

### 3. Configure the Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
NODE_ENV=development

# From your Supabase project settings → API
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# From https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=google/gemma-3-27b-it:free
```

### 4. Install Dependencies & Seed Database

```bash
# Install backend dependencies
cd backend
npm install

# Seed the live Supabase database with sample ERP data
npm run db:seed
```

### 5. Start the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✅ Server running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# ✅ App running at http://localhost:5173
```

---

## 📡 API Reference

- **Production Base URL:** `https://wfx-ecqx.onrender.com/api`
- **Local Base URL:** `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `GET` | `/dashboard` | KPIs, revenue trends, supplier stats |
| `GET` | `/products` | List finished goods (supports `?q=`, `?category=`, `?limit=`) |
| `GET` | `/suppliers` | List all suppliers with performance data |
| `GET` | `/buyers` | List all buyers |
| `GET` | `/orders` | List sales orders |
| `GET` | `/invoices` | List sales invoices |
| `POST` | `/ai/query` | Natural language → SQL query engine |
| `POST` | `/image/search` | Visual similarity search (multipart/form-data) |

---

## 🗄️ Database Schema

The production schema follows **3NF normalization** with dual-compatible columns (supports both the original controller field names and standard PostgreSQL naming conventions).

```
suppliers ──────────────────── finished_goods ──── tech_packs
    │                               │
    │                               │
buyers ──── sales_orders ──────────┘
                │
                └──── sales_invoices
                
ai_query_history  ·  activity_logs  ·  image_embeddings
```

**Key design decisions:**
- UUIDs as primary keys (via `gen_random_uuid()`)
- Automatic `updated_at` triggers on mutable tables
- B-tree indexes on all FK columns and frequently queried fields
- `DECIMAL(15,2)` for all financial amounts to prevent floating-point errors
- `CHECK` constraints on all enum-like status fields

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `5000`) |
| `NODE_ENV` | No | `development` or `production` |
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | Supabase anonymous API key |
| `OPENROUTER_API_KEY` | ✅ | OpenRouter API key for AI features |
| `OPENROUTER_MODEL` | No | LLM model slug (default: `google/gemma-3-27b-it:free`) |
| `TYPESENSE_API_KEY` | No | For high-performance vector search (optional) |

---

## 🧪 Testing

All non-AI endpoints verified with live Supabase data:

```
✅ GET /api/health          → Server operational
✅ GET /api/dashboard       → 12 goods, 5 suppliers, $352,900 revenue
✅ GET /api/products        → 12 products from Supabase
✅ GET /api/products?q=...  → Search working
✅ GET /api/suppliers       → 5 live supplier records
✅ GET /api/buyers          → 5 live buyer records
✅ GET /api/orders          → 5 sales orders
✅ GET /api/invoices        → 2 invoices
```

---

## 🐳 Docker Support

The project is fully containerized using **Docker** and **Docker Compose** for local development. The Docker setup connects to the existing hosted Supabase database — no local database container is needed.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Engine + Docker Compose)
- Your `backend/.env` file must be configured with valid Supabase and OpenRouter credentials

### Architecture

```
┌─────────────────────────────────────────────────┐
│               Docker Compose                    │
│                                                 │
│  ┌──────────────┐       ┌──────────────────┐    │
│  │   Frontend   │       │     Backend      │    │
│  │  (Nginx:80)  │──────▶│  (Express:5000)  │────┼──▶ Supabase (Cloud)
│  │  Port: 3000  │       │   Port: 5000     │────┼──▶ OpenRouter (Cloud)
│  └──────────────┘       └──────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

| Service | Container | Host Port | Internal Port | Image |
|---------|-----------|-----------|---------------|-------|
| Frontend | `wfx-frontend` | `3000` | `80` | Nginx (Alpine) |
| Backend | `wfx-backend` | `5000` | `5000` | Node 22 (Alpine) |

### Build & Run

```bash
# Build and start all services
docker compose up --build

# Run in detached (background) mode
docker compose up --build -d
```

Once running, open:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Useful Commands

```bash
# View running containers
docker compose ps

# View logs (all services)
docker compose logs

# View logs (specific service, follow mode)
docker compose logs -f backend
docker compose logs -f frontend

# Stop all containers
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild a specific service
docker compose build backend
docker compose build frontend

# Restart a specific service
docker compose restart backend
```

### Environment Variables

The Docker setup reads environment variables from `backend/.env`. No secrets are hardcoded in any Docker file. Ensure your `.env` contains:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
OPENROUTER_API_KEY=your-openrouter-key
```

> **Note:** Docker is for local development only. Production deployments continue to use **Vercel** (frontend) and **Render** (backend).

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Sunny Singh**  
Roll No: 2311981524  
Chitkara University

[![GitHub](https://img.shields.io/badge/GitHub-SunnySingh128-181717?style=flat-square&logo=github)](https://github.com/SunnySingh128)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ for the WFX AI-Native ERP Platform</sub>
</div>
