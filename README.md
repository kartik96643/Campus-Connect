# Campus Connect

A full-stack college community and networking platform developed to improve communication and collaboration among students, faculty, and administrators.

Campus Connect allows users to create profiles, connect with other students, search users based on skills and academic details, and communicate through real-time chat functionality. The platform focuses on responsive design, efficient user management, and optimized performance.

---

# Features

## User Features

* User registration and login authentication
* JWT-based secure authentication and authorization
* User profile management
* Search and filter users by:

  * Skills
  * University
  * Course
  * Semester
  * Gender
  * Batch
* Real-time chatting using WebSockets / Socket.io
* Responsive design for desktop and mobile devices


## Admin Features

* Admin dashboard
* Edit and delete users
* User management system
* Protected admin routes
* Role-based access control

---

# Tech Stack

## Frontend

* EJS
* HTML
* CSS
* Bootstrap
* JavaScript

## Backend

* Node.js
* Express.js
* REST APIs

## Database

* MongoDB
* Mongoose

## Authentication & Security

* JWT Authentication
* bcrypt
* Protected Routes

## Real-Time Communication

* Socket.io / WebSockets


---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/your-username/campus-connect.git
```

## Navigate to Project Folder

```bash
cd campus-connect
```

---

# Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# Run the Application

## Start Development Server

```bash
npm start
```

OR

```bash
nodemon server.js
```

---

# Performance Optimizations

* Responsive UI for better mobile experience
* Optimized backend routes and database queries
* Real-time communication using WebSockets

---

# Future Improvements

* Video/audio calling support
* Friend request system
* Notifications and messaging status
* AI-based student recommendations
* Group chats and communities
* Dark mode support

---

# Purpose of Project

This project was developed to strengthen full-stack development skills by implementing real-world functionalities such as authentication, real-time communication, scalable backend architecture, user search and filtering, and responsive UI design.

---

# Author

Kartik Jangid
