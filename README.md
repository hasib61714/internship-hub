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

**Internship Hub** is a full-stack, role-based internship management platform that bridges the gap between students seeking opportunities and employers hunting for fresh talent. Built with **React** and **Laravel**, it provides dedicated dashboards for each user role under a structured, admin-supervised environment. The platform includes a bilingual interface (Bengali & English) and department-wise filtering for an experience tailored to Bangladeshi academic institutions.

---

## Features

- **Student Portal** — Browse internships, filter by department, and submit applications with a single click
- **Employer Dashboard** — Post positions, review applicant profiles, and manage the full hiring pipeline
- **Admin Panel** — Platform oversight: user management, post moderation, and analytics
- **JWT Authentication** — Stateless, secure token-based authentication across all roles
- **Role-Based Access Control** — Strict, separate permissions for students, employers, and admins
- **Bilingual Interface** — Full Bengali and English language support throughout the UI
- **Department-wise Filtering** — Search internships by academic department, field, or location

---

## Tech Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,laravel,mysql,vercel&theme=dark" />
  </a>
</p>

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Laravel (PHP) |
| Database | MySQL |
| Auth | JWT (JSON Web Tokens) |
| API | RESTful API |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js >= 18 & npm
- PHP >= 8.1 & Composer
- MySQL >= 8.0

### Installation

```bash
# Clone the repository
git clone https://github.com/hasib61714/internship-hub.git
cd internship-hub

# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed

# Frontend setup
cd ../frontend
npm install
cp .env.example .env.local
```

### Usage

```bash
# Start the Laravel backend
cd backend
php artisan serve

# Start the React frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
internship-hub/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/migrations/
│   └── routes/api.php
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        └── services/
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
