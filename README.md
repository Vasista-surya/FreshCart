# FreshCart — Grocery E-Commerce

A modern, full-stack grocery e-commerce web application built with React, Vite, Tailwind CSS, Framer Motion, Node.js, Express, and MongoDB.

## Features

### Customer
- 🏠 Home page with hero, categories, offers, featured products
- 🛍️ Products page with category filtering, search, and sorting
- 📦 Product detail with ratings, pricing, and add-to-cart
- 🛒 Cart with quantity controls and order summary
- 💳 Checkout with shipping address and payment method
- 📝 Order history with status tracking
- ❤️ Wishlist
- 📞 Contact page
- 🔐 Authentication (Login & Signup with mascot animation)

### Admin
- 📊 Dashboard with stats overview
- 📦 Product management (CRUD)
- 📋 Order management with status updates
- 👥 User management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 3, Framer Motion 12, React Router 7 |
| Backend | Node.js, Express 5, MongoDB, Mongoose, JWT |
| Icons | React Icons |
| HTTP | Axios |

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm start
```

> The backend automatically falls back to an in-memory mock database if MongoDB is unavailable.

### Demo Credentials
- **Admin**: admin@freshcart.com / admin123
- **User**: user@freshcart.com / user123

## Deployment

### GitHub Pages
The frontend builds with relative asset paths (`base: './'`), making it compatible with GitHub Pages.

```bash
cd frontend
npm run build
```

### Vercel
Deploy directly — no additional configuration needed.

## Project Structure
```
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── public/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── config/
├── README.md
└── .gitignore
```
