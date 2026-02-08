# Cinema Ticket Booking MVP with QR Code Integration

Website pembelian tiket bioskop dengan QR code, F&B, promo code, dan booking timer.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| UI Library | HeroUI (Tailwind-based) |
| Database | PostgreSQL + Prisma ORM |
| Queue | Redis (BullMQ) - Booking Timer |
| Auth | NextAuth.js (Admin & Staff) |
| QR Code | qrcode library |

---

## Key Features

### 🎫 Booking Timer (Redis Queue)
Kursi di-hold 15 menit saat customer mulai booking. Jika tidak selesai checkout, Redis job akan release kursi otomatis.

### 🪑 Seat Selection
- **Multi-seat**: Pilih beberapa kursi sekaligus
- **Seat Preview**: Tampilkan posisi layar & pintu keluar
- **Seat Types**: Regular, Premium, VIP dengan harga berbeda

### 🔍 Order Lookup
Customer bisa cari tiket via email + phone di `/orders/lookup`

### 🖨️ Manual Order (Staff)
Staff bisa buat order untuk customer walk-in di `/staff/manual-order` dengan opsi print tiket

### 📱 Unified QR
1 QR per order, staff scan di halaman berbeda untuk tiket vs F&B

---

## Industry-Ready Optimizations (Completed)

### 1. Architecture
- **Feature-Based Structure**: `src/features/` (auth, staff) + `src/core/` + `src/lib/`
- **Centralized Types**: Moved to `src/core/types.ts` and feature-specific files
- **Middleware**: Renamed compatibility fix `src/middleware/` -> `src/middlewares/`

### 2. Security & Performance
- **Rate Limiting**: 5 req/min (auth), 100 req/min (general)
- **CORS**: Configurable origins via `CORS_ORIGINS`
- **Env Validation**: Fail-fast startup check
- **Health Check**: `/api/health` endpoint

### 3. Observability
- **Request Logging**: Structured logs (duration, status, user)

### 4. Quality Assurance
- **Unit Tests**: 35 tests (Jest) covering validators, auth, cors, etc.
- **Scripts**: Added `db:*` utility scripts

---

## Database Schema
(Schema remains same as previous plan)

## API Routes & Frontend Pages
(Routes remain same, but now implemented with feature-based structure)
