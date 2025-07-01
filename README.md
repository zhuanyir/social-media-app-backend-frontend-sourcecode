# Social Media Web App

A full-stack social media application built with React, Node.js, and PostgreSQL. This project supports typical social features including user registration and login, posting updates, commenting, liking, user relationship management, and profile updates.

---

## Features

- User authentication with JWT and Cookie-based dual authentication  
- Secure password hashing using bcrypt  
- Responsive UI built with React and React Query for state and asynchronous data management  
- RESTful API backend powered by Node.js and Express  
- PostgreSQL database managing core data and relations  
- Posts support text and image uploads (handled by Multer)  
- Commenting, liking, and dynamic post feed  
- User relationships: follow and unfollow logic  
- Modular code structure separating controllers, routes, and database queries  
- CORS and security best practices implemented  

---

## Tech Stack

- **Frontend:** React, React Query, Axios, Context API  
- **Backend:** Node.js, Express, JWT, bcrypt, Multer  
- **Database:** PostgreSQL  
- **Authentication:** JWT + Cookie dual mechanism  
- **Others:** CORS handling, REST API design  

---

## Project Structure
/client # React frontend source code
/server # Node.js backend source code

### Prerequisites

- Node.js (v14 or above)  
- PostgreSQL installed and running  
- npm or yarn package manager  

### Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/zhuanyir/social-media-app-backend-frontend-sourcecode.git
   cd social-media-web-app

Create a .env file in the /server directory with the following variables:
PORT=8800
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
COOKIE_SECRET=your_cookie_secret_key
CORS_ORIGIN=http://localhost:5143
