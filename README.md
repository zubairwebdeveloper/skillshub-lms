<div align="center">

<img src="public/logo.png" alt="Skills Hub LMS Logo" width="120" />

# 🎓 Skills Hub LMS

### Learn. Build. Grow.

**A modern, scalable, and beautifully designed Learning Management System (LMS)**
built with **Next.js**, **React**, **Firebase**, **Tailwind CSS**, and **shadcn/ui**.

Empowering students with premium learning experiences while giving administrators
powerful, intuitive tools to manage courses, users, and content.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#-license)

<br/>

[![Stars](https://img.shields.io/github/stars/zubairwebdeveloper/skillshub-lms?style=social)](https://github.com/zubairwebdeveloper/skillshub-lms/stargazers)
[![Forks](https://img.shields.io/github/forks/zubairwebdeveloper/skillshub-lms?style=social)](https://github.com/zubairwebdeveloper/skillshub-lms/network/members)
[![Issues](https://img.shields.io/github/issues/zubairwebdeveloper/skillshub-lms?color=orange)](https://github.com/zubairwebdeveloper/skillshub-lms/issues)

<br/>

[Live Demo](#) · [Report Bug](https://github.com/zubairwebdeveloper/skillshub-lms/issues) · [Request Feature](https://github.com/zubairwebdeveloper/skillshub-lms/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Preview](#-preview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Responsive Design](#-responsive-design)
- [Authentication](#-authentication)
- [Course Modules](#-course-modules)
- [Performance](#-performance)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## ✨ Overview

**Skills Hub LMS** is a next-generation online learning platform designed for
students, instructors, and educational businesses.

The platform focuses on **practical learning**, **modern UI/UX**, **responsive design**,
**secure authentication**, and **scalable architecture** — everything you need to run
a premium online academy.

Whether learners are studying programming, AI, or web development, Skills Hub LMS
delivers a smooth, engaging experience across every device.

---

## 🖼️ Preview

<div align="center">

| Home Page | Dashboard |
|:---:|:---:|
| <img src="https://placehold.co/500x300?text=Home+Page" alt="Home Page Preview" width="100%"/> | <img src="https://placehold.co/500x300?text=Dashboard" alt="Dashboard Preview" width="100%"/> |

| Course Page | Dark Mode |
|:---:|:---:|
| <img src="https://placehold.co/500x300?text=Course+Page" alt="Course Page Preview" width="100%"/> | <img src="https://placehold.co/500x300?text=Dark+Mode" alt="Dark Mode Preview" width="100%"/> |

> 💡 Replace the placeholder images above with real screenshots — drop them in `public/screenshots/` and update the paths.

</div>

---

## 🚀 Features

<table>
<tr>
<td valign="top" width="50%">

### 👨‍🎓 Student Features

- 🔐 Secure Authentication
- 📊 Beautiful Dashboard
- 🛍️ Browse Premium Courses
- 🗂️ Course Categories
- 🎥 Responsive Video Lessons
- 📈 Progress Tracking
- 🏆 Certificates
- ❤️ Wishlist
- ⭐ Course Reviews
- 🔎 Search & Filter
- 🌙 Dark Mode
- 📱 Mobile Friendly

</td>
<td valign="top" width="50%">

### 👨‍💼 Admin Features

- 🧭 Admin Dashboard
- 📚 Course Management
- 🎓 Student Management
- 👨‍🏫 Instructor Management
- 📉 Analytics Dashboard
- 🗃️ Category Management
- ⬆️ Upload Lessons
- 📋 Manage Enrollments
- 🛡️ User Roles
- 🔥 Firebase Integration

</td>
</tr>
</table>

### 🎨 UI Highlights

| | | |
|---|---|---|
| ✅ Premium SaaS Design | ✅ Responsive Layout | ✅ Modern Components |
| ✅ Glassmorphism Effects | ✅ Dark / Light Theme | ✅ Smooth Animations |
| ✅ Accessible UI | ✅ Optimized Performance | ✅ Clean Typography |

---

## 🛠 Tech Stack

<div align="center">

| Category | Technology |
|:---|:---|
| **Framework** | Next.js 16 |
| **Library** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Components** | shadcn/ui |
| **Icons** | Lucide React + React Icons |
| **Authentication** | Firebase Auth |
| **Database** | Cloud Firestore |
| **Storage** | Firebase Storage |
| **Forms** | React Hook Form |
| **Validation** | Zod |
| **Theming** | next-themes |
| **Deployment** | Vercel |

</div>

---

## 📂 Project Structure

```text
src/
│
├── app/                # App router pages & layouts
├── components/
│   ├── layout/          # Navbar, Footer, wrappers
│   ├── home/             # Landing page sections
│   ├── dashboard/        # Student & admin dashboards
│   ├── course/           # Course cards, player, details
│   ├── auth/              # Login, register, auth forms
│   └── ui/                 # shadcn/ui components
│
├── hooks/               # Custom React hooks
├── lib/                  # Config & helper libraries
├── services/              # Firebase / API service layers
├── utils/                   # Utility functions
├── context/                  # React context providers
├── styles/                    # Global styles
└── public/                     # Static assets & fonts
```

---

## 📱 Responsive Design

<div align="center">

| 🖥️ Desktop | 💻 Laptop | 📱 Tablet | 📲 Mobile |
|:---:|:---:|:---:|:---:|
| ✅ | ✅ | ✅ | ✅ |

**Fully optimized for every screen size — from 320px to 4K.**

</div>

---

## 🔐 Authentication

- 📧 Email & Password Login
- 📝 Register Account
- 🔵 Google Sign-In
- 🔑 Forgot Password
- 🛡️ Protected Routes
- ⏳ User Session Management

---

## 📚 Course Modules

<div align="center">

`Web Development` · `HTML & CSS` · `JavaScript` · `React` · `Next.js` · `Tailwind CSS` · `Firebase` · `Python` · `Artificial Intelligence` · `Chatbot Automation`

</div>

---

## ⚡ Performance

- 🚀 Fast Loading
- 🔍 SEO Friendly
- 🖼️ Optimized Images
- 🐢 Lazy Loading
- ✂️ Code Splitting
- 🖥️ Server-Side Rendering
- ♿ Accessibility Ready

---

## 💻 Installation

```bash
# Clone the repository
git clone https://github.com/zubairwebdeveloper/skillshub-lms.git

# Move into the project directory
cd skillshub-lms

# Install dependencies
npm install

# Run the development server
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser. 🎉

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Never commit your `.env.local` file — make sure it's listed in `.gitignore`.

---

## 🌟 Future Roadmap

- [ ] 🏆 Student Certificates
- [ ] 🔴 Live Classes
- [ ] 📝 Assignments
- [ ] ❓ Quizzes
- [ ] 🤖 AI Learning Assistant
- [ ] 👨‍🏫 Instructor Panel
- [ ] 💬 Discussion Forum
- [ ] 🔔 Notifications
- [ ] 💳 Payment Integration
- [ ] 🛒 Course Marketplace
- [ ] 📱 Mobile App

---

## 🤝 Contributing

Contributions are always welcome! Here's how to get started:

1. 🍴 **Fork** the repository
2. 🌿 Create a **feature branch**: `git checkout -b feature/amazing-feature`
3. 💾 **Commit** your changes: `git commit -m "Add amazing feature"`
4. 📤 **Push** your branch: `git push origin feature/amazing-feature`
5. 🔁 Open a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ❤️ Built For

<div align="center">

`Students` · `Developers` · `Instructors` · `Educational Institutes` · `Coding Academies` · `Online Learning Platforms`

</div>

---

## ⭐ Support

If you found this project helpful, please consider:

⭐ **Starring** this repository
🍴 **Forking** the project
💡 **Sharing** your feedback

<div align="center">

<br/>

Made with ❤️ using **Next.js**, **React**, **Firebase**, **Tailwind CSS**, and **shadcn/ui**.

### **Skills Hub LMS**
*Learn Today. Build Tomorrow.*

</div>