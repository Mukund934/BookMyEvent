<div align="center">

<img src="./frontend/src/assets/BookMyEventLogo.png" alt="BookMyEvent Logo" width="280"/>


A modern full-stack Event Booking Platform built with React, TypeScript, Node.js, Express, MongoDB, Redis, and JWT Authentication.

</div>
<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

A full-stack Event Booking System built with modern backend practices, secure authentication, analytics, caching, and transaction-safe booking workflows.

Designed as part of a Full Stack Developer Internship Assessment while focusing on maintainability, scalability, and real-world engineering practices.

</div>

---

## 📸 Preview

### 🏠 Landing Page

<p align="center">
  <img src="./frontend/public/home.png" width="90%" alt="Landing Page">
</p>

---

### 🎫 Discover Events

<p align="center">
  <img src="./frontend/public/events.png" width="90%" alt="Events Listing">
</p>

---

### 🎪 Event Details & Seat Availability

<p align="center">
  <img src="./frontend/public/insideOneEvent.png" width="90%" alt="Event Details">
</p>

---

### 🛒 Booking Workflow

<p align="center">
  <img src="./frontend/public/insideOneEvent1.png" width="90%" alt="Booking Workflow">
</p>

---

### 📊 Dashboard Analytics

<p align="center">
  <img src="./frontend/public/dashboard.png" width="90%" alt="Dashboard Analytics">
</p>

---

### 📋 My Bookings

<p align="center">
  <img src="./frontend/public/myBookings.png" width="90%" alt="My Bookings">
</p>

---

## ✨ Features

### Authentication

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes
* Rate Limited Authentication Endpoints

### Event Management

* Create Events
* View All Events
* Event Details
* Event Analytics
* Pagination Support
* Filtering Support

### Booking Management

* Book Seats
* View Personal Bookings
* Cancel Bookings
* Automatic Seat Restoration
* Duplicate Booking Prevention

### Analytics Dashboard

* Total Revenue
* Total Bookings
* Cancellation Rate
* Top Performing Events
* Monthly Booking Trends

### Performance Optimizations

* Redis Caching
* Dashboard Cache Layer
* Booking Cache Layer
* Analytics Cache Layer
* Cache Invalidation Strategy

### Security

* Helmet Security Middleware
* Rate Limiting
* JWT Authorization
* Request Validation
* Centralized Error Handling

---

## 🏗️ Complete System Architecture

```text
┌─────────────────────────────────────┐
│             Frontend                │
│                                     │
│ React + TypeScript + Vite           │
│ Tailwind CSS                        │
│ React Router                        │
│ Axios                               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          Service Layer              │
│                                     │
│ auth.service.ts                     │
│ event.service.ts                    │
│ booking.service.ts                  │
│ dashboard.service.ts                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          Backend API                │
│                                     │
│ Node.js                             │
│ Express.js                          │
│ TypeScript                          │
│ JWT Authentication                  │
│ Zod Validation                      │
│ Error Middleware                    │
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
┌─────────────┐  ┌─────────────┐
│    Redis    │  │  MongoDB    │
│             │  │             │
│ Analytics   │  │ Users       │
│ Events      │  │ Events      │
│ Bookings    │  │ Bookings    │
│ Dashboard   │  │ Analytics   │
└─────────────┘  └─────────────┘
```

### Frontend Architecture

```text
src
│
├── pages
│   ├── landing
│   ├── auth
│   ├── events
│   ├── bookings
│   └── dashboard
│
├── components
│   ├── Layout
│   ├── Navbar
│   ├── ProtectedRoute
│   └── UI Components
│
├── services
│   ├── auth.service.ts
│   ├── event.service.ts
│   ├── booking.service.ts
│   └── dashboard.service.ts
│
├── types
│
└── assets
```

### Backend Architecture

```text
src
│
├── config
├── controllers
├── middleware
├── models
├── routes
├── services
├── validators
├── utils
├── types
└── server.ts
```

The application follows a modular full-stack architecture with clear separation between frontend UI, API services, business logic, caching, and database layers. This structure improves maintainability, scalability, and developer experience.



## ⚙️ Tech Stack

### Frontend

- React.js
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Sonner (Toast Notifications)

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- MongoDB
- Mongoose

### Caching

- Redis

### Authentication

- JWT (JSON Web Tokens)

### Validation

- Zod

### API Documentation

- Swagger UI

### Deployment

- Vercel (Frontend)
- Render (Backend)



## 🎯 Frontend Highlights

- Modern Responsive UI
- Protected Routes
- JWT Authentication Flow
- Event Discovery Experience
- Event Details Page
- Real-Time Seat Availability
- Booking Management
- Booking Cancellation
- Dashboard Analytics
- Event Creation Workflow
- Reusable Component Architecture
- API Service Layer Pattern
- Toast Notifications & User Feedback

---

## 🧪 Demo Test Account

You can use the following account to test the application:

### User Account

Email:
```text
test2@gmail.com
```

Password:
```text
12345678
```

Features available for testing:

- User Login
- Browse Events
- View Event Details
- Create Event
- Book Seats
- View My Bookings
- Cancel Booking
- Dashboard Analytics
- Logout

## 🌐 Live Demo


###  Frontend Application

 **[Launch BookMyEvent](https://book-my-event-lovat.vercel.app/)**

---

### ⚡ Backend API

 **[Backend Service](https://bookmyevent-backend-2u7p.onrender.com)**

---

### 📚 API Documentation

 **[Swagger Documentation](https://bookmyevent-backend-2u7p.onrender.com/api-docs)**


---

## 🔒 Booking Consistency

One important challenge in booking systems is preventing overselling when multiple users attempt to book seats simultaneously.

To address this:

* MongoDB Transactions are used
* Seat updates and booking creation happen together
* Failed operations automatically roll back
* Prevents inconsistent booking states

This ensures bookings remain reliable even under concurrent requests.

---

## 📊 Dashboard Overview Endpoint

```http
GET /api/dashboard/overview
```

Returns:

```json
{
  "totalRevenue": 125000,
  "totalBookings": 430,
  "cancelledBookings": 12,
  "cancellationRate": 2.79,
  "topEvents": [],
  "monthlyTrends": []
}
```

---

## 📚 API Documentation

Swagger documentation is available at:

```bash
/api-docs
```

The API documentation includes:

* Authentication APIs
* Event APIs
* Booking APIs
* Dashboard APIs
* Request/Response Schemas

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

REDIS_URL=your_redis_connection_string
```

### Run Development Server

```bash
npm run dev
```

Server:

```bash
http://localhost:5000
```

Swagger:

```bash
http://localhost:5000/api-docs
```

---

## 📂 Project Structure

```text
src
├── config
├── controllers
├── middleware
├── models
├── routes
├── services
├── utils
├── types
└── server.ts
```

---

## 🧠 Design Decisions

### Why MongoDB?

The application deals with flexible event and booking data structures. MongoDB provides a simple and scalable document model that fits these requirements well.

### Why Redis?

Frequently accessed analytics and booking data are cached to reduce database load and improve response times.

### Why Transactions?

Booking creation and seat updates must remain consistent. Transactions ensure both operations either succeed together or fail together.

### Why Swagger?

Swagger provides interactive API documentation and makes testing endpoints easier during development and evaluation.

---

## 🔮 Future Improvements

* Payment Gateway Integration
* Email Notifications
* Role-Based Access Control
* Event Search Enhancements
* Event Image Uploads
* Admin Dashboard
* Real-Time Booking Updates
* Docker Deployment

---

## 👨‍💻 Author

**Mukund Thakur**

B.Tech, Electronics & Communication Engineering
IIIT Naya Raipur



---

Built with a focus on clean architecture, reliability, and real-world backend engineering practices.
