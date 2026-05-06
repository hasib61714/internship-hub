<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:6E40C9,50:A855F7,100:06B6D4&height=200&section=header&text=Internship%20Hub&fontSize=48&fontColor=fff&animation=fadeIn&fontAlignY=38&desc=Role-Based%20Internship%20Management%20Platform&descAlignY=58&descSize=18" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/hasib61714/internship-hub/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT" />
  </a>
  <a href="https://github.com/hasib61714/internship-hub/stargazers">
    <img src="https://img.shields.io/github/stars/hasib61714/internship-hub?style=for-the-badge&color=A855F7" alt="Stars" />
  </a>
  <a href="https://github.com/hasib61714/internship-hub/network/members">
    <img src="https://img.shields.io/github/forks/hasib61714/internship-hub?style=for-the-badge&color=06B6D4" alt="Forks" />
  </a>
</p>

---

## About

**Internship Hub** is a full-stack, role-based internship management platform that bridges the gap between students seeking opportunities and companies hunting for fresh talent. Built with **Next.js** and **Supabase**, it provides dedicated dashboards for each user role under a structured, admin-supervised environment. The platform supports real-time notifications, messaging, and dark/light theme toggle.

---

## Features

- **Student Portal** — Browse internships, apply with one click, track applications, and save jobs
- **Company Dashboard** — Post positions, review applicants, manage job listings and templates
- **Admin Panel** — Platform oversight: user management, post moderation, verifications, and analytics
- **Supabase Auth** — Secure authentication with email/password and session management
- **Role-Based Access Control** — Strict, separate permissions for students, companies, and admins
- **Real-time Notifications** — Live notification bell with unread count
- **Messaging System** — In-app messaging between students and companies
- **Dark / Light Theme** — Full theme toggle support throughout the UI

---

## Tech Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,supabase,vercel&theme=dark" />
  </a>
</p>

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Frontend | React, Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js >= 18 & npm
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Clone the repository
git clone https://github.com/hasib61714/internship-hub.git
cd internship-hub

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Usage

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
internship-hub/
├── app/
│   ├── admin/          # Admin dashboard pages
│   ├── company/        # Company dashboard pages
│   ├── student/        # Student dashboard pages
│   ├── jobs/           # Public job listings
│   ├── messages/       # Messaging system
│   └── notifications/  # Notifications page
├── components/         # Shared UI components
├── contexts/           # React context (Auth, Theme)
├── hooks/              # Custom React hooks
└── lib/                # Supabase client & utilities
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:06B6D4,50:A855F7,100:6E40C9&height=120&section=footer" width="100%" />
</p>

<p align="center">
  Made with dedication by <a href="https://github.com/hasib61714">Md. Hasibul Hasan</a>
</p>
