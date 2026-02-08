# 🎬 Movie Company API

Backend API untuk sistem manajemen bioskop.

## Tech Stack

- **Next.js 16** - API Routes
- **Prisma 7** - PostgreSQL ORM
- **JWT** - Authentication
- **Zod** - Validation
- **Swagger** - API Documentation

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database
npx prisma db seed

# Start dev server
npm run dev
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/movie_company"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Get current user |

### Staff (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/staff` | List all staff |
| POST | `/api/staff` | Create staff |
| GET | `/api/staff/:id` | Get staff |
| PATCH | `/api/staff/:id` | Update staff |
| DELETE | `/api/staff/:id` | Delete staff |

## Default Users

| Email | Password | Role |
|-------|----------|------|
| admin@cinema.com | admin123 | ADMIN |
| staff@cinema.com | staff123 | STAFF |

## API Documentation

Swagger UI tersedia di: `http://localhost:3000/docs`

## Project Structure

```
src/
├── app/api/        # Route handlers
├── services/       # Business logic
├── validators/     # Zod schemas
├── middleware/     # Auth middleware
├── utils/          # Helpers
└── lib/            # Prisma, JWT
```

## Scripts

```bash
npm run dev      # Development
npm run build    # Production build
npm run lint     # ESLint
```
