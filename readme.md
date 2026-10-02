# 🛒 Cartify - Premium Full-Stack MERN E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.2-blue.svg)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.18-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready, feature-rich full-stack e-commerce web platform built with **MongoDB Atlas**, **Express.js**, **React 18**, and **Node.js**.

---

## ✨ Features

- 🛍️ **520+ Products Catalog:** Rich collection across 20 distinct categories and 35 top global brands.
- 🎟️ **Promo & Coupon Engine:** Instant discount calculation with active codes (`CARTIFY50`, `WELCOME20`, `SAVE10`) at checkout.
- 🧾 **Order Invoice PDF Generation:** One-click downloadable and printable tax invoice PDFs for completed orders.
- 📊 **Real-Time Admin Analytics:** Live sales revenue tracker, order metrics, and category inventory distribution charts.
- 🌓 **Dark / Light Theme Toggle:** Customizable MUI themes with persistent local storage preferences.
- 🔐 **Secure Authentication:** JWT authentication with HTTP-only cookies, password hashing with bcrypt, and OTP verification flow.
- 🔍 **Dynamic Filtering & Search:** Category filters, brand filters, pagination, and multi-tier sorting.
- 🛒 **Interactive Cart & Wishlist:** Real-time quantity adjustments, wishlisting, and persistent state management via Redux Toolkit.
- 💳 **Checkout & Orders:** Modern responsive 2-column checkout with delivery address selection and order tracking.
- 🏥 **Health & Uptime Monitoring:** Dedicated `/health` endpoint for monitoring backend service health and uptime.
- 📱 **Fully Responsive UI:** Built with Material-UI (MUI), Framer Motion animations, and Lottie assets.
- 🚀 **Cloud Deployments:** Frontend deployed on Vercel, Backend deployable on Render with full CORS support.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Redux Toolkit, React Router v6, Material-UI (MUI), Framer Motion, Axios |
| **Backend** | Node.js, Express.js, Mongoose ODM, JWT, Nodemailer, BcryptJS |
| **Database** | MongoDB Atlas (Cloud) |
| **Deployment** | Vercel (Frontend), Render / Vercel (Backend) |

---

## 🚀 Quick Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/ayush-3945/cartify-mern.git
cd cartify-mern
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

### 4. Seed 520+ Demo Products
```bash
cd backend
node seed/seed500Products.js
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
