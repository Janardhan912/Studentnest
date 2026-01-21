# Student Housing Portal

A full-stack MERN application for verified student housing and roommate matching.

## Features
- **User Roles**: Student, Owner, Admin
- **Authentication**: JWT + Bcrypt + Role-based Access Control
- **Properties**: Search, Filter, Maps, Reviews, Verified Listings
- **Roommate Matching**: Algorithmic matching based on lifestyle preferences
- **Admin**: Verification of owners/properties, content moderation

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB (Mongoose)

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas URI (or local MongoDB)

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   - Rename `.env.example` to `.env` (if exists) or create one.
   - Set `MONGO_URI`, `JWT_SECRET`, etc.
4. Seed Database (Optional):
   ```bash
   npm run seed
   ```
   *Creates Admin (admin@example.com / 123456) and sample users.*
5. Run Server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Dev Server:
   ```bash
   npm run dev
   ```

## Deployment

### Backend (Render/Railway)
1. Push code to GitHub.
2. Connect repository to Render/Railway.
3. Set Root Directory to `backend`.
4. Add Environment Variables from `.env`.
5. Build Command: `npm install`
6. Start Command: `npm start`

### Frontend (Vercel)
1. Push code to GitHub.
2. Import project in Vercel.
3. Set Root Directory to `frontend`.
4. Vercel automatically detects Vite.
5. Deploy.

## API Documentation
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/properties`
- `POST /api/match/preferences`
