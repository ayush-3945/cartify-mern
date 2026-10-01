# ?? Cartify – Full-Stack E-commerce Website

A complete, production-ready e-commerce web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It includes a user-friendly UI, secure JWT authentication, admin controls, shopping cart functionality, order tracking, and a responsive layout.

---

## ? Features

* **User Authentication:** User Registration & Login with secure JWT Authentication & Bcrypt password hashing
* **Admin Dashboard:** Full product management (Add / Edit / Delete products)
* **Search & Filters:** Real-time product search, category filtering, and sorting
* **Product Details:** Detailed product view with images, stock status, and specifications
* **Shopping Cart & Checkout:** Dynamic cart management and streamlined checkout flow
* **Order History:** User order tracking and status updates
* **Protected Routes:** Role-based access control for Admins and Customers
* **Responsive Design:** Optimized for Desktop, Tablet, and Mobile viewports

---

## ??? Tech Stack

### Frontend
* **React.js** (v18)
* **Redux Toolkit** (State Management)
* **Material-UI (MUI)** & Emotion
* **Framer Motion** & Lottie Animations
* **React Router DOM** & Axios

### Backend
* **Node.js** & **Express.js**
* **MongoDB Atlas** with **Mongoose ODM**
* **JSON Web Tokens (JWT)** for stateless auth
* **Bcrypt.js** for password encryption
* **Nodemailer** for email notifications

---

## ?? Getting Started

### 1. Clone the Repository

`ash
git clone https://github.com/ayush-3945/cartify-mern.git
cd cartify-mern
`

### 2. Backend Setup

`ash
cd backend
npm install
`

Create a .env file inside the ackend/ directory:

`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_jwt_key
`

Start the backend server:

`ash
npm run dev
`

### 3. Frontend Setup

In a new terminal window:

`ash
cd frontend
npm install
npm run start
`

---

## ?? Future Enhancements

* Integrated Payment Gateway (Razorpay / Stripe)
* Product Ratings, Reviews & Image Uploads
* User Wishlist & Saved Items
* Automated SMS & Push Notifications

---

## ?? Contact & Author

**Ayush Kumar Pandey**  
* GitHub: [https://github.com/ayush-3945](https://github.com/ayush-3945)  
* Email: [ayushpandey23042006@gmail.com](mailto:ayushpandey23042006@gmail.com)

---

## ?? License

This project is open-source and licensed under the [MIT License](LICENSE).
