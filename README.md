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
*   **UI Framework (Frontend):** Material UI
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

## Sprint 2: Certificate Registration by Technician - COMPLETED

Sprint 2 focuses on enabling certified technicians to register energy producer certificates for clients.

**Key achievements:**
1.  **Backend Updates:**
    *   The `User` model (`backend/models/User.js`) was updated to include a 'client' role, allowing for the distinction of client users for whom certificates will be registered.
    *   A new `Certificate` model (`backend/models/Certificate.js`) was created to store certificate information, including `userId` (linking to the client), `userName`, `certificateFile` (currently a path/filename placeholder), and `issuedBy` (linking to the technician).
    *   New API routes were added in `backend/routes/certificates.js`:
        *   `POST /api/certificates/register`: Allows an authenticated technician to register a new certificate. It includes basic validation and links the certificate to a client user and the issuing technician. (Note: Full file upload with `multer` is pending).
        *   `GET /api/certificates/search`: Allows technicians to search for client users by ID or username. This was updated to perform a case-insensitive search for users with the 'client' role, returning their `id`, `username`, and `name` (defaulting to `username` if `name` is not present).
    *   The main server file (`backend/server.js`) was updated to incorporate these new certificate routes.
    *   The `authMiddleware` in `backend/routes/certificates.js` was updated to perform JWT verification. It now extracts the token from the `Authorization` header, verifies it using `jsonwebtoken`, attaches the decoded user information to `req.user`, and ensures that only users with the 'technician' role can access protected certificate-related routes. This resolved an issue where `issuedBy` was not being correctly populated for new certificates.

2.  **Frontend Updates:**
    *   A new page `CertificateRegistrationPage.js` (`frontend/src/pages/`) was created to host the certificate registration form.
    *   A new form component `CertificateRegistrationForm.js` (`frontend/src/components/`) was developed. This form allows technicians to:
        *   Search for client users by ID or name (with debounced API calls).
        *   Select a user from the search results.
        *   Input a certificate file (currently accepts `.pdf` and sends the filename; actual file upload to backend is pending).
        *   Submit the certificate details for registration.
    *   A new service `certificateService.js` (`frontend/src/services/`) was created to handle API calls to the backend for searching users and registering certificates.
    *   The main application routing in `frontend/src/App.js` was updated:
        *   A new protected route `/register-certificate` was added for the `CertificateRegistrationPage`.
        *   A `TechnicianProtectedRoute` component was implemented to ensure only users with the 'technician' role can access this new route.
        *   A link to the "Register Certificate" page was added to the `HomePage` component, visible only to logged-in technicians.

**Functionality Overview:**
*   A technician logs into the system.
*   If they are a technician, they will see a link on their home page to "Register Certificate".
*   Clicking this link takes them to the certificate registration page.
*   On this page, they can search for a client user by their ID or name.
*   After selecting a user, they can choose a PDF certificate file.
*   Upon submission, the certificate information (including user details and a placeholder for the file path) is sent to the backend and saved in the database.

**UI Enhancements with Material UI (Sprint 2 Bonus):**
*   The entire frontend application has been refactored to use Material UI components for a consistent and modern look and feel.
*   `App.js` now includes `CssBaseline` for base styling and a new `AppLayout` component with a persistent `AppBar` (navigation bar) and `Footer`.
*   Loading states across the application (e.g., in `ProtectedRoute`, `PublicRoute`) now use Material UI `CircularProgress`.
*   `LoginPage.js` and `LoginForm.js` have been redesigned with Material UI `Container`, `Paper`, `TextField`, `Button`, `Alert`, etc.
*   `CertificateRegistrationPage.js` has been updated with Material UI layout components (`Container`, `Paper`, `Typography`).
*   `CertificateRegistrationForm.js` now utilizes Material UI `Autocomplete` for user search, styled `