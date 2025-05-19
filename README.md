# Electricity Consumption and Production Management Software

This project is a web application for managing renewable energy production from solar panels.

## Project Description

The application supports:
*   JWT-based user authentication.
*   Solar panel installation registration and technician approval.
*   Real-time monitoring of customers' energy production (via an external API).
*   Energy credits accounting for surplus energy and bill offsetting.

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Frontend:** React
*   **Database:** MongoDB (with Mongoose ODM)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Encryption:** bcryptjs
*   **HTTP Client (Frontend):** Axios
*   **Package Managers:** npm

## Sprint 1: Authentication Feature (Frontend+Backend) - COMPLETED

Sprint 1 focused on creating the basic authentication mechanism. This sprint is now **complete**.

**Key achievements:**
1.  A login form (frontend) for users to enter credentials.
2.  A backend API endpoint for credential validation and JWT generation.
3.  JWT storage in `sessionStorage` on the frontend.
4.  A simple user registration mechanism (backend - for testing).
5.  Inclusion of user roles in the JWT for future role-based access.

The backend involved creating a `User` model (with password hashing using `bcryptjs`), setting up the main `server.js` (Express.js, environment variables, middleware, MongoDB connection), and defining authentication routes (`/api/auth/register`, `/api/auth/login`) for user registration and login, including JWT generation.

The frontend development included `AuthContext` for global authentication state management (storing token and user info in `sessionStorage`), the main `App.js` for routing (using `react-router-dom` with protected and public routes), an `authService.js` for API communication (using `axios`), and UI components like `LoginForm.js` and `LoginPage.js`. A basic `HomePage.js` with a logout function was also implemented.

## Setup and Running Details

### Prerequisites

*   Node.js and npm
*   MongoDB (local server or MongoDB Atlas)
*   Git (Optional)
*   Postman (Optional - for API testing)

### 1. Obtaining the Project

```bash
git clone https://github.com/tahayunusdemir/Web-Programming-Final-Project.git
cd Web-Programming-Final-Project
```

### 2. Backend Setup

```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder with your `MONGO_URI` (MongoDB connection string, e.g., for local MongoDB: `mongodb://localhost:27017/energy-management` or your Atlas string) and `JWT_SECRET`.
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_and_long_jwt_key_here
PORT=5001
```
Start the server:
```bash
npm run dev # For development (uses nodemon)
# OR
npm start   # For production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```
You might encounter warnings about deprecated packages or security vulnerabilities. For Sprint 1, these are a secondary priority as long as the application runs. You can try `npm audit fix`. Use `npm audit fix --force` with caution.

Start the frontend:
```bash
npm start
```
This usually opens the app at `http://localhost:3000`.

### 4. Testing the Application

*   **a. New User Registration (via Backend API):**
    Use Postman (or similar) to `POST` to `http://localhost:5001/api/auth/register` with `username`, `password`, and `role` in the JSON body.
*   **b. User Login (via Frontend):**
    Navigate to `http://localhost:3000`, enter credentials, and check for redirection to `/home` and `sessionStorage` for `token` and `user`.
*   **c. Incorrect Login Attempt:**
    Test with invalid credentials to see error messages.
*   **d. Protected Page Access and Session Persistence:**
    Close and reopen the tab after login; you should remain logged in. Attempting to access `/login` while logged in should redirect to `/home`.
*   **e. Logging Out:**
    Click "Logout" on `/home`. You should be redirected to `/login`, and `sessionStorage` items should be cleared.

## Next Steps (For Other Sprints)

*   Creation of a user registration form and page.
*   More detailed error handling and user feedback.
*   Forgot password / password reset feature.
*   Role-based authorization.
*   Frontend form validation.

## Setup and Execution

Detailed setup and execution instructions will be added to the README files in the backend and frontend folders and here as the sprint progresses.

### Backend Setup (Preliminary Information)

```bash
cd backend
npm install
# Configure the .env file (MONGO_URI, JWT_SECRET)
npm start # or npm run dev
```

### Frontend Setup (Preliminary Information)

```bash
cd frontend
npm install
npm start