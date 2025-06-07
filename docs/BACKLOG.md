# Project History (Backlog)

This file keeps a record of completed tasks and the commands used throughout the project.

## Phase 1: Project Setup and Administration

### Group Formation and Registration
- **Task:** Group was formed and registered on Discord.
- **Details:** The project will be done by a single person. Registration was completed on the Discord channel.

### GitHub Repository Setup
- **Task:** A private GitHub repository was created and the instructor was invited.
- **Details:** Repository URL: `https://github.com/tahayunusdemir/Web-Programming-Final-Project`
- **Commands/Steps Used:**
  - A new private repository named `Web-Programming-Final-Project` was created via the GitHub interface.
  - The instructor was invited as a "Collaborator" to the GitHub repository.
  - The following commands were run in the local project folder:
  ```bash
  git init
  git remote add origin https://github.com/tahayunusdemir/Web-Programming-Final-Project.git
  touch README.md
  git add README.md
  git commit -m "Initial commit"
  git push -u origin main
  ```

### Sprint Planning
- **Task:** Sprints were planned and documented.
- **Details:** Sprint plans and the task list were added by creating `README.md` and `docs/TODO.md` files.
- **Commands Used:**
  ```bash
  mkdir docs
  touch docs/TODO.md
  # File contents were edited
  git add .
  git commit -m "docs: Add sprint planning and project TODO list"
  git push
  ```
- **Notes:** Since the project is being developed by a single person, the same person will be the "Product Owner" for all sprints.

---

### Sprint 1: Authentication Feature Implementation
- **Task:** Implemented the complete user authentication and authorization feature (frontend and backend) for Sprint 1.
- **Details:** 
  - **Backend (Node.js/Express):**
    - Established a connection to MongoDB.
    - Created a `User` model with `username`, `password`, and `role` fields. Passwords are automatically hashed using `bcryptjs` before being stored.
    - Developed a `POST /api/auth/login` endpoint to validate credentials.
    - Upon successful login, a JSON Web Token (JWT) containing the user's ID, username, and role is generated and sent to the client.
    - Created a database seeding script (`seed.js`) to pre-populate the `users` collection with one user for each role (`Client`, `Technician`, `Operations Manager`).
  - **Frontend (React):**
    - Set up a React application with Material-UI for components.
    - Created a global `AuthContext` to manage authentication state, storing the JWT in `sessionStorage` to persist the session.
    - Developed a `LoginPage` for users to sign in.
    - Implemented a `ProtectedRoute` component to restrict access to pages based on authentication status and user roles.
    - Configured application-wide routing with `react-router-dom`, defining public, protected, and role-specific routes.
  - **Documentation:**
    - Updated `docs/TODO.md` to mark all Sprint 1 tasks as complete.
- **Commands Used:**
  ```bash
  # Backend Dependency Installation
  cd backend
  npm install express mongoose bcryptjs jsonwebtoken dotenv cors

  # Frontend Dependency Installation
  cd ../frontend
  npm install axios jwt-decode react-router-dom @mui/material @emotion/react @emotion/styled

  # Running the Application
  # To seed the database (run once from /backend):
  npm run seed
  # To start the backend server (from /backend):
  npm run dev
  # To start the frontend application (from /frontend):
  npm start
  ```
- **Notes:** The implementation adheres to the project requirements. User registration is intentionally omitted; users must be added directly to the database.

### Sprint 2: Solar Panel Installation & Certificate Management
- **Task:** Implemented the complete feature for clients to register solar panel installations and for technicians to validate them and upload certificates.
- **Details:**
  - **Backend (Node.js/Express):**
    - Created authorization middleware (`authMiddleware.js`) with `protect` (JWT verification) and `authorize` (role-based access) functions to secure endpoints.
    - Defined a Mongoose `Installation` model to store installation data, including a client reference, technical details, location, status, and certificate path.
    - Developed `installationController.js` with the business logic for creating, retrieving, validating installations, and uploading PDF certificates using `multer`.
    - Configured routes in `installations.js`, applying the authorization middleware to restrict access based on 'Client' and 'Technician' roles.
    - Updated `server.js` to serve uploaded certificates as static files and to mount the new installation routes under `/api/installations`.
  - **Frontend (React):**
    - Created `installationService.js` to handle all API requests to the new backend endpoints, including sending the JWT for authorization.
    - Redesigned `ClientPage.js` to include a form for submitting new installations and a list displaying the status of the user's existing installations.
    - Overhauled `TechnicianPage.js` to display all installation records in a card layout. Each card includes actions for technicians to validate the installation and upload a PDF certificate.
    - Updated `App.js` to add the new routes (`/client`, `/technician`), protecting them with the `ProtectedRoute` component to enforce role restrictions.
    - Enhanced `DashboardPage.js` with conditional links that navigate users to the appropriate page based on their role.
- **Commands Used:**
  ```bash
  # Backend Dependency Installation for file uploads
  cd backend
  npm install multer
  ```
- **Notes:** This sprint successfully implements the core workflow for installation and certificate management, building upon the authentication system from Sprint 1. The implementation strictly follows the role-based access control requirements.

### Sprint 3: Energy Monitoring & Credit Accounting
- **Task:** Implemented the full feature set for monitoring energy production and managing customer energy credits.
- **Details:**
    - **Mock Customer API:**
        - Created a separate Node.js service (`mock-customer-api`) to simulate real-time energy production data from customers.
        - This service exposes a `GET /production` endpoint that returns a random kilowatt value, decoupling the main application from the data source.
    - **Backend (Node.js/Express):**
        - Created a `Production` model to log energy readings with timestamps and associated clients.
        - Developed a `/api/production/:idClient` endpoint, accessible only by 'Operations Manager' roles, which fetches data from the Mock API and records it in the database.
        - Added an endpoint for managers to retrieve all clients (`/api/auth/clients`).
        - Implemented the credit accounting logic in `creditController.js`. A new endpoint `/api/credits/:idClient/calculate` allows managers to manually trigger a monthly credit calculation.
        - The calculation uses total production from the last month against a placeholder for consumption, awarding credits for any surplus.
        - Added `email` and `credits` fields to the `User` model to store accumulated credits and support notifications.
        - Created a `notificationService.js` to simulate sending email notifications to clients upon receiving new credits.
    - **Frontend (React):**
        - Developed new services (`productionService.js`, `creditService.js`) to communicate with the new backend endpoints.
        - Completely overhauled the `OperationsManagerPage.js` to create a functional dashboard.
        - The dashboard now lists all clients, allowing the manager to select one to view their production history in an accordion.
        - Added buttons to manually trigger a new production reading from the mock API and to calculate the selected client's monthly credits.
        - The interface displays the results of the credit calculation, including total production, awarded credits, and the client's new balance.
- **Commands Used:**
  ```bash
  # Set up the mock API
  cd mock-customer-api
  npm install

  # Install backend dependencies
  cd ../backend
  npm install axios

  # Re-seed the database with new user fields
  npm run seed
  ```
- **Notes:** This sprint delivers the core monitoring and accounting features. The credit calculation currently uses a placeholder for energy consumption. The email notification is a simulation logged to the console, as a full email service is outside the current scope.

### **Template for Future Tasks**

*You can copy and use the format below when adding new completed tasks to this backlog.*

```markdown
### <Task Title>
- **Task:** <A brief description of the completed task>
- **Details:** <Additional details about the task, decisions made, etc., if necessary.>
- **Commands Used:**
  ```bash
  # Add the terminal commands you used
  # for this task in this section.
  ```
- **Notes:** <Additional notes, things to be aware of, etc., if any.>
``` 