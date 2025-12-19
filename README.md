# 🚀 Internship Hub - Complete Professional Platform

## 📋 Overview

**Internship Hub** is a comprehensive, Fiverr-style marketplace connecting students, freelancers, and companies across Bangladesh. The platform supports flexible hiring models including hourly work, project-based contracts, internships, part-time, and full-time positions.

---

## ✨ Key Features

### 👥 **Multi-Role System**
- **Students/Employees**: Browse jobs, apply, manage applications, earn certificates
- **Companies**: Post jobs, manage applications, hire talent, issue certificates
- **Admin**: Platform moderation, user verification, job approval, analytics

### 💼 **Flexible Job Types**
- Hourly (e.g., "Need developer for 15 hours")
- Daily (Short-term tasks)
- Project-based (Fixed scope with milestones)
- Part-time (Ongoing, flexible hours)
- Full-time (Permanent positions)
- Internships (3-6 months with certificates)

### 🎯 **Core Features**
- ✅ User Authentication & Authorization
- ✅ Advanced Job Search & Filters
- ✅ Application Management System
- ✅ Real-time Notifications
- ✅ Certificate Generation (Coming soon)
- ✅ Rating & Review System (Coming soon)
- ✅ Messaging System (Coming soon)
- ✅ Verification Badges
- ✅ Admin Dashboard with Analytics
- ✅ Responsive Modern UI

---

## 🛠️ Technology Stack

### Backend
- **Laravel 10** - PHP Framework
- **MySQL** - Database
- **Laravel Sanctum** - API Authentication
- **RESTful API** Architecture

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **Lucide React** - Icons

---

## 📦 Project Structure

```
Internship-Hub/
├── backend/                    # Laravel API (Port 8000)
│   ├── app/
│   │   ├── Models/            # 15+ Eloquent models
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── JobController.php
│   │   │   │   └── AdminController.php
│   │   │   └── Middleware/
│   │   │       └── CheckRole.php
│   ├── routes/
│   │   └── api.php            # API routes
│   ├── config/
│   │   └── cors.php           # CORS configuration
│   └── .env                    # Environment variables
│
└── frontend/                   # React App (Port 5173)
    ├── src/
    │   ├── components/         # Reusable components
    │   │   └── Navbar.jsx
    │   ├── contexts/           # React Context API
    │   │   └── AuthContext.jsx
    │   ├── services/           # API service layer
    │   │   └── api.js
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Jobs.jsx
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── Student/
    │   │   │   └── Dashboard.jsx
    │   │   └── Company/
    │   │       └── Dashboard.jsx
    │   ├── App.jsx              # Main app with routing
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    └── .env                     # Environment variables
```

---

## 🗄️ Database Schema

**20+ Tables:**
- users
- students
- companies
- jobs
- applications
- contracts
- certificates
- reviews
- conversations
- messages
- notifications
- saved_jobs
- portfolios
- work_logs
- categories
- skills
- reports
- system_settings
- And more...

---

## 🚀 Installation

### Prerequisites
- XAMPP (Apache + MySQL)
- Composer (PHP package manager)
- Node.js (v18+)
- Git (optional)

### Step 1: Database Setup

1. Start XAMPP (Apache + MySQL)
2. Open phpMyAdmin
3. Import `internship_hub_database.sql`
4. ✅ Database ready with demo data!

### Step 2: Backend Setup

```powershell
cd C:\Users\"Md Hasibul Hasan"\Documents\Internship-Hub\backend

# Install dependencies
composer install

# Configure .env
cp .env.example .env
# Edit .env with database credentials

# Generate key
php artisan key:generate

# Clear cache
php artisan config:clear
php artisan route:clear

# Start server
php artisan serve
```

Backend runs on: `http://localhost:8000`

### Step 3: Frontend Setup

```powershell
cd C:\Users\"Md Hasibul Hasan"\Documents\Internship-Hub\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🧪 Demo Accounts

### Admin
```
Email: admin@internshiphub.com
Password: password
```

### Company
```
Email: company1@test.com
Password: password
```

### Student
```
Email: student1@test.com
Password: password
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Jobs
- `GET /api/jobs` - List all jobs (with filters)
- `GET /api/jobs/{id}` - Get job details
- `POST /api/jobs` - Create job (Company)
- `PUT /api/jobs/{id}` - Update job (Company)
- `DELETE /api/jobs/{id}` - Delete job (Company)

### Applications
- `POST /api/jobs/{id}/apply` - Apply to job (Student)
- `GET /api/my-applications` - My applications (Student)
- `GET /api/jobs/{id}/applications` - Job applications (Company)
- `PUT /api/applications/{id}/status` - Update status (Company)

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - List all users
- `PUT /api/admin/students/{id}/verify` - Verify student
- `PUT /api/admin/companies/{id}/verify` - Verify company
- `PUT /api/admin/jobs/{id}/moderate` - Approve/reject job

---

## 🎨 UI Features

- **Modern Fiverr-style Design**
- **Responsive Layout** (Mobile-friendly)
- **Clean Card-based Components**
- **Smooth Animations & Transitions**
- **Professional Color Scheme** (Blue gradient)
- **Icon-rich Interface** (Lucide React)
- **Loading States & Error Handling**

---

## 🔐 Security Features

- JWT Authentication (Laravel Sanctum)
- Password Hashing (Bcrypt)
- Role-based Access Control
- CORS Protection
- Input Validation
- SQL Injection Prevention

---

## 📊 Admin Features

- Platform Statistics Dashboard
- User Management (Activate/Deactivate)
- Verification System (Students & Companies)
- Job Moderation
- Report Management
- Analytics & Insights

---

## 🎯 Roadmap (Future Features)

- [ ] Real-time Chat System
- [ ] Certificate Generation (PDF)
- [ ] Payment Integration
- [ ] Rating & Review System
- [ ] Email Notifications
- [ ] Advanced Analytics
- [ ] Mobile App
- [ ] File Upload System
- [ ] Video Interviews

---

## 🐛 Troubleshooting

### Problem: "Connection refused"
**Solution:** Ensure MySQL is running in XAMPP

### Problem: "CORS Error"
**Solution:** 
```powershell
php artisan config:clear
php artisan serve
```

### Problem: "Routes not found"
**Solution:**
```powershell
php artisan route:clear
php artisan route:cache
```

### Problem: "Login failed"
**Solution:** Check database has users with hashed passwords

---

## 📞 Support

For issues or questions:
1. Check backend terminal for errors
2. Check frontend console (F12) for errors
3. Verify both servers are running
4. Check .env configuration
5. Clear browser cache

---

## 🎉 Success Checklist

- [ ] XAMPP MySQL running
- [ ] Database imported successfully
- [ ] Backend running on port 8000
- [ ] API working (http://localhost:8000/api/categories)
- [ ] Frontend running on port 5173
- [ ] Can login with demo accounts
- [ ] Dashboard loads correctly
- [ ] Jobs page shows listings
- [ ] No console errors

---

## 📄 License

This project is created for educational purposes as a university capstone project.

---

## 👨‍💻 Developer

**Developed by:** Md Hasibul Hasan  
**University:** Green University of Bangladesh  
**Department:** Computer Science & Engineering  
**Project:** Capstone - Internship Hub Platform  
**Year:** 2025

---

## 🙏 Acknowledgments

- Laravel Framework
- React.js
- Tailwind CSS
- Lucide Icons
- All open-source contributors

---

## 🎯 Project Status

✅ **Phase 1:** Database Design - COMPLETE  
✅ **Phase 2:** Backend API - COMPLETE  
✅ **Phase 3:** Frontend UI - COMPLETE  
⏳ **Phase 4:** Testing - IN PROGRESS  
⏳ **Phase 5:** Deployment - PENDING  

---
**Thank You**
