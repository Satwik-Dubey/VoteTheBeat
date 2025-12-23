# [VoteTheBeat](https://vote-the-beat-app.vercel.app/) &nbsp; | &nbsp; [Demo](https://youtu.be/nXKknfs2YVc)

A collaborative, real-time music queue and voting app.  
Built with React (Vite), Express, Prisma, PostgreSQL (NeonDB), Socket.IO, and deployed on Vercel (frontend) and Render (backend).

---

## 🚀 Features

- **Create and join sessions** for collaborative music listening
- **Add songs** to a shared queue (with JioSaavn search integration)
- **Vote** on songs to reorder the queue in real time
- **Remove songs** from the queue
- **Live updates** across all users via WebSockets (Socket.IO)
- **Persistent storage** with PostgreSQL (NeonDB)
- **Modern UI** with React and Tailwind CSS

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Socket.IO Client
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, Socket.IO
- **Database:** PostgreSQL (NeonDB)
- **Music API:** JioSaavn (via public proxies)
- **Deployment:** Vercel (frontend), Render (backend)

---

## 🏗️ Project Structure

```
/frontend    # React app (Vite)
/backend     # Express API + Socket.IO + Prisma
```

---

## ⚡ Getting Started (Local Development)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/votethebeat.git
cd votethebeat
```

### 2. Setup the backend

```bash
cd backend
cp .env.example .env   # Fill in your DATABASE_URL for NeonDB or local Postgres
npm install
npx prisma db push     # Or npx prisma migrate deploy
npm run dev
```

### 3. Setup the frontend

```bash
cd ../frontend
cp .env.example .env   # Set VITE_API_BASE_URL to your backend URL (local or Render)
npm install
npm run dev
```

---

## 📝 Usage

1. **Create a session** (as a host)
2. **Share the session code** with friends
3. **Add songs** to the queue (search via JioSaavn)
4. **Vote** for your favorite songs
5. **Watch the queue update live** for all users

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

[MIT](LICENSE)

---

*Made with ❤️ by Satwik Dubey!*