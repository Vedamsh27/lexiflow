# 📚 LexiFlow

> A vocabulary learning app powered by spaced repetition — learn smarter, not harder.

🔗 ## 🚀 Live Project
**Production URL:**  
https://lexiflow-gp88j4c2x-vedamsh27s-projects.vercel.app/

---

## ✨ Features

- 🔐 **Authentication** — Register & login with JWT-based auth
- 🃏 **Flashcard Review** — Again / Hard / Good / Easy buttons powered by SM-2 algorithm
- 🔥 **Streak Tracker** — Daily streak counter with freeze warning
- 🎯 **Word of the Day** — A new highlighted word every day
- 📝 **Quiz Mode** — Multiple choice quiz (pick the right word from 4 options)
- 📚 **Library** — Browse all seen words with mastery bars and search
- 🏆 **Mastery Badges** — Earn badges at 1, 10, 50, 100 mastered words
- 📊 **Progress Chart** — Bar chart of words reviewed over the last 7 days
- 👤 **Profile Page** — View stats: total words, mastered, learning

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon serverless) |
| ORM | Prisma |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Algorithm | SM-2 Spaced Repetition |
| Charts | Recharts |
| Deployment | Vercel |

---

## 🏗 Architecture

```
Browser
   │
   ▼
Next.js App Router (Frontend + API Routes)
   │
   ├── /app/(auth)         → Login / Register pages
   ├── /app/dashboard      → Daily words + streak + word of day
   ├── /app/review         → Flashcard review with SM-2
   ├── /app/quiz           → Multiple choice quiz
   ├── /app/library        → All seen words with mastery
   ├── /app/profile        → Stats + badges
   ├── /app/chart          → Progress chart (last 7 days)
   │
   └── /app/api/           → API Routes
         ├── auth/login
         ├── auth/register
         ├── daily-words
         ├── words/[id]/review   ← SM-2 + streak logic
         ├── streak
         ├── quiz
         ├── library
         ├── profile
         ├── badges
         ├── chart
         └── word-of-the-day
               │
               ▼
         Prisma ORM
               │
               ▼
         PostgreSQL (Neon)
```

---

## 🗄 Database Schema

```prisma
User          → id, name, email, passwordHash, streak, lastReviewDate
Word          → id, word, definition, example, difficulty
WordProgress  → userId, wordId, easeFactor, interval, repetitions, nextReviewDate
ReviewLog     → userId, wordId, quality, reviewedAt
```

---

## 🧠 SM-2 Algorithm

Each flashcard review updates the word's schedule using the SM-2 spaced repetition algorithm:

- **Again (0)** → Reset, review tomorrow
- **Hard (2)** → Short interval
- **Good (4)** → Normal interval
- **Easy (5)** → Longer interval

The `easeFactor` and `interval` determine when you'll see the word next — words you know well appear less often.

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database (or a free [Neon](https://neon.tech) account)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Vedamsh27/lexiflow.git
cd lexiflow

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed the database with 304 words
npm run seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
lexiflow/
├── app/
│   ├── (auth)/login        # Login page
│   ├── (auth)/register     # Register page
│   ├── api/                # All API routes
│   ├── dashboard/          # Daily words + streak
│   ├── review/             # Flashcard UI
│   ├── quiz/               # Multiple choice quiz
│   ├── library/            # Word library
│   ├── profile/            # User profile + badges
│   └── chart/              # Progress chart
├── components/
│   └── Navbar.tsx          # Smart navbar
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── auth.ts             # JWT verification
│   └── sm2.ts              # SM-2 algorithm
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # 304 real words seeder
└── proxy.ts                # Route protection middleware
```

---

## 🌱 Seed Data

The database is seeded with **304 real English words** with definitions fetched from [dictionaryapi.dev](https://dictionaryapi.dev). Words include adjectives, verbs, and nouns across varying difficulty levels.

---

## 📄 License

MIT © Vedamsh Cheripelli
