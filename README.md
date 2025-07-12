# ReWear – Community Clothing Exchange

ReWear is a web-based platform that enables users to exchange unused clothing via direct swaps or a point-based system. Designed to promote sustainable fashion and reduce textile waste.

## Features

- **User Authentication**: Secure email/password signup & login
- **Landing Page**: Introduction, mission, featured items, CTAs
- **Browsing & Search**: Search/filter by category, name, tags, etc.
- **Item Management**: List, view, and manage clothing items with images and details
- **Swaps & Points**: Direct swap requests or point-based redemption
- **User Dashboard**: Profile, points, listed items, and swap history
- **Admin Panel**: Moderate listings, users, and swaps
- **Real-time Updates**: Live sync for swaps and listings
- **Responsive UI**: Mobile-first, accessible, and performant

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (via Supabase)
- **Auth & Realtime**: Supabase Auth + Supabase Realtime
- **State Management**: React Query
- **Image Storage**: Supabase Storage

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account & project

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourorg/rewear.git
   cd rewear
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a Supabase project.
   - Set up tables using `supabase/schema.sql`.
   - Copy `.env.example` to `.env` and add your Supabase keys.

4. **Run the app**
   ```bash
   npm run dev
   ```

## Folder Structure

```
rewear/
├── backend/             # Express.js API (optional, most logic in Supabase)
├── src/                 # React frontend
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── utils/
├── supabase/            # DB schema & policies
├── public/
├── .env.example
└── README.md
```

## Database Schema

See [`supabase/schema.sql`](supabase/schema.sql).

## Design

![Wireframes](image1)

## License

MIT