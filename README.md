<div align="center">

<img src="./frontend/src/assets/BookMyEventLogo.png" alt="BookMyEvent Logo" width="280"/>

#  BookMyEvent

A modern full-stack Event Booking Platform built with React, TypeScript, Node.js, Express, MongoDB, Redis, and JWT Authentication.

</div>
<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge\&logo=redis\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)

A full-stack Event Booking System built with modern backend practices, secure authentication, analytics, caching, and transaction-safe booking workflows.

Designed as part of a Full Stack Developer Internship Assessment while focusing on maintainability, scalability, and real-world engineering practices.

</div>

---

## 📸 Preview

### Home Page

<p align="center">
<img src="./assets/screenshots/home.png" width="90%">
</p>

---

### Event Listing

<p align="center">
<img src="./assets/screenshots/events.png" width="90%">
</p>

---

### Event Details

<p align="center">
<img src="./assets/screenshots/event-details.png" width="90%">
</p>

---

### Dashboard Analytics

<p align="center">
<img src="./assets/screenshots/dashboard.png" width="90%">
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

## 🏗️ Architecture

```text
Client
   │
   ▼
Express API
   │
   ├── Authentication Layer
   ├── Validation Layer
   ├── Controllers
   ├── Business Logic
   ├── Redis Cache
   └── MongoDB
```

The application follows a modular architecture to keep controllers focused, improve maintainability, and make future feature additions easier.

---

## ⚙️ Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* MongoDB
* Mongoose

### Caching

* Redis

### Authentication

* JWT

### Validation

* Zod

### Documentation

* Swagger UI

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

GitHub: https://github.com/Mukund934

LinkedIn: https://www.linkedin.com/in/mukund-thakur-b9949b212/

---

Built with a focus on clean architecture, reliability, and real-world backend engineering practices.
