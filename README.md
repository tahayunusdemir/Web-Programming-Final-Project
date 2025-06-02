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
6.  A user registration form (frontend at `/register`) allowing new users to sign up with a username, password, and selectable role (client, technician, operationsManager).

The backend involved creating a `User` model (with password hashing using `bcryptjs`), setting up the main `server.js` (Express.js, environment variables, middleware, MongoDB connection), and defining authentication routes (`/api/auth/register`, `/api/auth/login`) for user registration and login, including JWT generation.

The frontend development included `AuthContext` for global authentication state management (storing token and user info in `sessionStorage`), the main `App.js` for routing (using `react-router-dom` with protected and public routes), an `authService.js` for API communication (using `axios`), and UI components like `LoginForm.js`, `LoginPage.js`, `RegistrationForm.js`, and `RegistrationPage.js`. A basic `HomePage.js` with a logout function was also implemented.

## Sprint 2: Certificate Registration by Technician & Solar Panel Installation - COMPLETED

Sprint 2 focuses on enabling certified technicians to register energy producer certificates for clients and allowing clients to register their solar panel installations. This sprint is now **complete**.

**Key achievements for Certificate Registration:**
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

**Functionality Overview (Certificate Registration):**
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
*   `CertificateRegistrationForm.js` now utilizes Material UI `Autocomplete` for user search, styled `Button` for file uploads (with icon and file name display), `TextField`, `Alert`, and `CircularProgress` for a richer user experience.
*   The `HomePage.js` (defined within `App.js`) has been updated with Material UI `Typography` and `Box`.
*   Relevant `.css` files for these components have been removed as styling is now primarily handled by Material UI `sx` props and components.

**Key achievements for Solar Panel Installation Registration:**
1.  **Backend Updates:**
    *   A new `Installation` model (`backend/models/Installation.js`) was created to store details about solar panel installations, including `clientId`, `address`, `panelModel`, `panelCount`, `installationDate`, and `status` (defaulting to 'Pending').
    *   New API routes were added in `backend/routes/installations.js`:
        *   `POST /api/installations/register`: Allows an authenticated client to register a new solar panel installation. It includes validation and saves the installation details with a 'Pending' status.
    *   An authentication middleware (`clientAuthMiddleware`) was added to `backend/routes/installations.js` to ensure only users with the 'client' role can access this route.
    *   The main server file (`backend/server.js`) was updated to incorporate these new installation routes.

2.  **Frontend Updates:**
    *   A new page `InstallationRegistrationPage.js` (`frontend/src/pages/`) was created for clients.
    *   A new form component `InstallationRegistrationForm.js` (`frontend/src/components/`) was developed. This form allows clients to input installation details (address, panel info, date).
    *   A new service `installationService.js` (`frontend/src/services/`) was created for API calls related to installations.
    *   The main application routing in `frontend/src/App.js` was updated:
        *   A new protected route `/register-installation` was added for the `InstallationRegistrationPage`.
        *   A `ClientProtectedRoute` component was implemented.
        *   A link to "Register Installation" was added to the `AppLayout` navigation bar, visible only to logged-in clients.

**Functionality Overview (Solar Panel Installation):**
*   A client logs into the system.
*   They see a "Register Installation" link in the navigation.
*   Clicking this link takes them to the installation registration page.
*   On this page, they can fill in the details of their solar panel installation.
*   Upon submission, the installation request is saved with a 'Pending' status. (Approval mechanism is out of scope for this sprint).

## Sprint 3: Renewable Energy Production Monitoring & Energy Credits - COMPLETED

Sprint 3 focused on implementing the functionality for Operations Managers to monitor renewable energy production of clients and manage energy credits. This sprint is now **complete**.

**Key achievements for Renewable Energy Production Monitoring:**
1.  **Backend Updates:**
    *   The `User` model (`backend/models/User.js`) was updated to include an 'operationsManager' role.
    *   New API routes were added in `backend/routes/production.js`:
        *   `GET /api/production/:idClient`: Allows an authenticated Operations Manager to fetch energy production data for a specific client. This endpoint interacts with a mock Customer API.
    *   An authentication middleware was added to `backend/routes/production.js` to ensure only users with the 'operationsManager' role can access these routes.
    *   The main server file (`backend/server.js`) was updated to incorporate these new production routes.
    *   The `GET /api/certificates/search` route in `backend/routes/certificates.js` was updated to be accessible by 'operationsManager' as well, allowing them to list all clients for monitoring purposes.

2.  **Frontend Updates:**
    *   A new page `ProductionMonitoringPage.js` (`frontend/src/pages/`) was created for Operations Managers to view client energy production.
    *   This page allows selection of a client and displays their energy production data fetched from the backend.
    *   A new service `productionService.js` (`frontend/src/services/`) was created to:
        *   Fetch a list of all clients (reusing the `GET /api/certificates/search` endpoint).
        *   Fetch energy production data for a selected client (`GET /api/production/:clientId`).
    *   The main application routing in `frontend/src/App.js` was updated:
        *   A new protected route `/production-monitoring` was added for the `ProductionMonitoringPage`.
        *   An `OperationsManagerProtectedRoute` component was implemented.
        *   A link to the "Monitor Production" page was added to the `AppLayout` navigation bar, visible only to logged-in Operations Managers.

3.  **Mock Customer API:**
    *   A separate mock Node.js server (`mock-customer-api/mock-server.js`) was implemented.
    *   This API has an endpoint `GET /production` that returns random kilowatt values, simulating real-time energy production data from a customer's system.

**Functionality Overview (Renewable Energy Production Monitoring):**
*   An Operations Manager logs into the system.
*   They see a "Monitor Production" link in the navigation.
*   Clicking this link takes them to the production monitoring page.
*   On this page, they can select a client from a dropdown list.
*   After selecting a client and clicking "Fetch Production Data", the system retrieves data from the mock API (via the main backend) and displays the client's current energy production (kWh).

**Key achievements for Accounting for Energy Credits:**
1.  **Backend Updates:**
    *   A new `EnergyCredit` model (`backend/models/EnergyCredit.js`) was created to store records of energy credits, including `clientId`, `kwhGenerated`, `creditsEarned`, and `calculationDate`.
    *   New API routes were added in `backend/routes/energyCredits.js` for CRUD operations on energy credits:
        *   `POST /api/energy-credits`: Create a new energy credit record.
        *   `GET /api/energy-credits/client/:clientId`: Get all credits for a specific client.
        *   `GET /api/energy-credits/:creditId`: Get a specific credit record.
        *   `PUT /api/energy-credits/:creditId`: Update an existing credit record.
        *   `DELETE /api/energy-credits/:creditId`: Delete a credit record.
    *   These routes are protected and accessible only by 'operationsManager' role using the existing `authMiddleware.js`.
    *   The main server file (`backend/server.js`) was updated to include these new energy credit routes.

2.  **Frontend Updates:**
    *   A new page `EnergyCreditsPage.js` (`frontend/src/pages/`) was created for Operations Managers.
    *   This page allows Operations Managers to select a client, view their existing energy credits, add new credit records, edit existing ones, and delete them.
    *   A new service `energyCreditService.js` (`frontend/src/services/`) was created to handle all API communications for energy credits.
    *   The main application routing in `frontend/src/App.js` was updated:
        *   A new protected route `/energy-credits` was added for the `EnergyCreditsPage`.
        *   This route is protected by the `OperationsManagerProtectedRoute`.
        *   A link to "Manage Energy Credits" was added to the `AppLayout` navigation bar, visible only to logged-in Operations Managers.

**Functionality Overview (Energy Credits):**
*   An Operations Manager logs into the system.
*   They see a "Manage Energy Credits" link in the navigation.
*   Clicking this link takes them to the energy credits management page.
*   On this page, they can select a client to view their credits.
*   They can add new credit records (specifying kWh generated, credits earned), edit existing records, or delete them.

## Getting Started: Setup and Execution

This section guides you through setting up and running all components of the application.

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

### 2. Setting Up and Running Services

For each service (Backend, Mock Customer API, Frontend), you will need to install dependencies and then run the service. It's recommended to run each in a separate terminal.

**Important Note on `npm install`:**
The `npm install` command downloads all necessary project dependencies. It is crucial for the initial setup of each service and should also be run if you pull changes that modify dependencies (e.g., adding a new library or updating versions). For subsequent daily runs where dependencies haven't changed, you can usually skip this step and directly use the run command (e.g., `npm run dev` or `npm start`) after navigating to the service's directory.

**a. Backend Service (`/backend`)**

1.  **Initial Setup & Run (Development):**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    *(Alternatively, for the very first setup or after dependency changes: `cd backend && npm install && npm run dev`)*

2.  **Environment Configuration:**
    Before the first run, create a `.env` file inside the `backend` folder. Copy the following structure and update it with your specific details:
    ```env
    MONGO_URI=your_mongodb_connection_string_here
    JWT_SECRET=your_super_secret_and_long_jwt_key_here
    PORT=5001
    MOCK_CUSTOMER_API_URL=http://localhost:5002 
    # Default mock API URL; adjust if your mock server runs elsewhere.
    ```
3.  **Subsequent Runs (Development):**
    ```bash
    cd backend
    npm run dev
    ```
    The backend server typically runs on `http://localhost:5001`.

**b. Mock Customer API Service (`/mock-customer-api`)**

1.  **Initial Setup & Run (Development):**
    ```bash
    cd mock-customer-api
    npm install
    npm run dev
    ```
    *(Alternatively: `cd mock-customer-api && npm install && npm run dev`)*

2.  **Subsequent Runs (Development):**
    ```bash
    cd mock-customer-api
    npm run dev
    ```
    The mock API server typically runs on `http://localhost:5002`.

**c. Frontend Service (`/frontend`)**

1.  **Initial Setup & Run (Development):**
    ```bash
    cd frontend
    npm install
    npm start
    ```
    *(Alternatively: `cd frontend && npm install && npm start`)*

    *Dependency Note:* If you pull project updates, especially those involving Material UI or other frontend libraries, re-run `npm install` in the `/frontend` directory to ensure all dependencies are current.

2.  **Subsequent Runs (Development):**
    ```bash
    cd frontend
    npm start
    ```
    The frontend development server usually opens automatically at `http://localhost:3000` in your web browser.

### 3. Running All Services Concurrently

To use the full application, all three services (Backend, Mock Customer API, and Frontend) must be running at the same time. Follow the steps above to start each service in its own dedicated terminal window or tab.

### 4. Testing the Application

*   **a. New User Registration (via Frontend UI):**
    Navigate to `http://localhost:3000/register`. Enter a username, password, and select a role. After successful registration, you should see a success message. You can then proceed to login with the new credentials. (Alternatively, Postman can still be used to `POST` to `http://localhost:5001/api/auth/register` with `username`, `password`, and `role`.)
*   **b. User Login (via Frontend):**
    Navigate to `http://localhost:3000`, enter credentials, and check for redirection to `/home` and `sessionStorage` for `token` and `user`.
*   **c. Incorrect Login Attempt:**
    Test with invalid credentials to see error messages.
*   **d. Protected Page Access and Session Persistence:**
    Close and reopen the tab after login; you should remain logged in. Attempting to access `/login` while logged in should redirect to `/home`.
*   **e. Logging Out:**
    Click "Logout" on `/home`. You should be redirected to `/login`, and `sessionStorage` items should be cleared.
*   **f. Certificate Registration (Technician):**
    1.  Log in as a 'technician'.
    2.  Navigate to the "Register Certificate" page.
    3.  Search for a 'client' user.
    4.  Select a user and a PDF file (filename is sent).
    5.  Submit the form and verify the success message.
*   **g. Production Monitoring (Operations Manager):**
    1.  Log in as an 'operationsManager'.
    2.  Navigate to the "Monitor Production" page.
    3.  Select a 'client' from the dropdown.
    4.  Click "Fetch Production Data" and verify that random kWh data is displayed for the client.
*   **h. Solar Panel Installation Registration (Client):**
    1.  Log in as a 'client'.
    2.  Navigate to the "Register Installation" page using the link in the app bar.
    3.  Fill out the installation details (address, city, postal code, panel model, panel count, installation date, notes).
    4.  Submit the form and verify the success message indicating the registration is pending approval.
*   **i. Energy Credits Management (Operations Manager):**
    1.  Log in as an 'operationsManager'.
    2.  Navigate to the "Manage Energy Credits" page using the link in the app bar.
    3.  Select a 'client' from the dropdown to view their existing credits or to add new ones.
    4.  Test adding a new credit: fill in kWh generated, credits earned, and optional notes. Verify the credit appears in the list.
    5.  Test editing an existing credit: click the edit icon, modify details, and save. Verify the changes.
    6.  Test deleting a credit: click the delete icon and confirm. Verify the credit is removed from the list.