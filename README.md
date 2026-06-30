# Healthcare Platform

A full-stack healthcare web application with patient management, doctor listings, appointment booking, and real-time communication.

## Tech Stack

**Frontend:** React 18, Redux Toolkit, Tailwind CSS, Vite, Socket.io-client, Firebase, Leaflet Maps

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Nodemailer, Socket.io, Google Generative AI

## Project Structure

```
healthcare-platform/
├── backend/        # Express REST API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── contactServer.js
└── Frontend/       # React + Vite app
    └── src/
        ├── components/
        ├── Pharmacy/
        └── redux/
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB instance (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_password>
GEMINI_API_KEY=<your_google_ai_key>
```

```bash
npm run dev       # runs both server.js and contactServer.js concurrently
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Features

- User & Doctor authentication (JWT)
- Appointment booking & management
- Doctor directory with search
- Contact / messaging system
- Real-time updates via Socket.io
- AI integration (Google Generative AI)
- Pharmacy section
- Interactive maps (Leaflet)
- Email notifications (Nodemailer)

## Deployment

- **Frontend:** Netlify (`netlify.toml` included)
- **Backend:** Vercel (`vercel.json` included)

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| backend | `npm start` | Start main server |
| backend | `npm run dev` | Start all servers concurrently |
| frontend | `npm run dev` | Start dev server |
| frontend | `npm run build` | Production build |
| frontend | `npm run lint` | Run ESLint |