# Electricity Consumption and Production Management Software

This project is a web application developed to support the management of renewable energy production from solar panels.

## Project Description (energy_management_system.md Summary)

The application aims to offer the following core functionalities:

*   **Authentication:** JWT-based user authentication.
*   **Solar Panel Installation Registration:** Registration of customer installations and technician approval.
*   **Energy Production Monitoring:** Real-time monitoring of customers' energy production (via an external API).
*   **Energy Credits Accounting:** Crediting of surplus energy produced and offsetting against bills.

## Technologies Used (Planned)

*   **Backend:** Node.js, Express.js
*   **Frontend:** React
*   **Database:** MongoDB (with Mongoose ODM)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Encryption:** bcryptjs
*   **HTTP Client (Frontend):** Axios
*   **Package Managers:** npm (or yarn)

## Sprint 1: Building the Authentication Feature (Frontend+Backend)

The goal of this sprint is to create the basic authentication mechanism that allows users to log in to the application securely.

**Objectives:**

1.  A login form (frontend) where users can enter their credentials (username, password).
2.  An API endpoint (backend) that validates the entered credentials and generates a JWT if successful.
3.  Storage of the generated JWT throughout the user session (frontend - `sessionStorage`).
4.  A simple user registration mechanism (backend - for testing and ease of use).
5.  Inclusion of the user role in the JWT for role-based access.

**In the following sections, the backend and frontend code developed within this sprint will be explained step by step.**

### Backend Development

#### 1. User Model (`backend/models/User.js`)

A Mongoose model has been created to store user information in the database. This model includes the following fields:

*   `username`: The user's unique name (String, required, lowercase).
*   `password`: The user's password (String, required, minimum 6 characters). The password is securely hashed using the `bcryptjs` library before being saved to the database.
*   `role`: The user's role in the system (String, enum: `'user'`, `'admin'`, `'technician'`, default: `'user'`). This field will be used for role-based authorization in the future.
*   `timestamps`: Automatically adds the creation (`createdAt`) and update (`updatedAt`) times of the record.

The model also includes two important methods:

*   `UserSchema.pre('save', ...)`: Automatically hashes the password before a user document is saved (or when the `password` field is updated).
*   `UserSchema.methods.comparePassword(enteredPassword)`: Compares the password entered by the user during login with the hashed password stored in the database.

This Mongoose model defines a schema for storing users' `username`, `password` (securely hashed with bcryptjs), and `role` information. It also includes a `pre-save` hook that automatically hashes passwords before they are saved and a `comparePassword` method that compares entered passwords with the hashed password in the database. Creation and update timestamps for records are also automatically added.

#### 2. Main Server File (`backend/server.js`)

This is the entry point of the backend application. It creates and manages a web server using the Express.js framework.

Its main functions are:

*   **Environment Variables:** Loads environment variables such as `MONGO_URI` (MongoDB connection string) and `PORT` from the `.env` file using the `dotenv` library.
*   **Middleware Setup:**
    *   `cors()`: Enables Cross-Origin Resource Sharing to allow requests from the frontend application (as it will run on a different port).
    *   `express.json()`: Parses JSON data in the body of incoming requests, making it accessible via `req.body`.
*   **Database Connection:** Connects asynchronously to the MongoDB database using the `mongoose` library. If the connection is successful, it logs an informational message to the console; if it fails, it shows an error message and terminates the application.
*   **Route Definitions:** Uses relevant route files (e.g., `routes/auth.js`) under main API paths like `/api/auth`. This makes the code more modular.
*   **Starting the Server:** After a successful MongoDB connection, it starts listening on the Express application via the specified port.
*   **Global Error Handling:** A simple middleware handles unhandled errors that may occur throughout the application, returning a standard error message to the client.

This Node.js file creates the main backend server using Express.js. It loads environment variables (e.g., MongoDB connection string, port number) from the `.env` file. It sets up basic middleware for incoming requests, such as CORS (Cross-Origin Resource Sharing) and a JSON body parser. It connects to the MongoDB database via the Mongoose library. It uses relevant route files for main API paths like `/api/auth` and includes a simple global error handling mechanism. After a successful database connection, it starts the server listening on the specified port.

#### 3. Authentication Routes (`backend/routes/auth.js`)

This file contains the API endpoints related to user registration and login. A modular structure has been created using `express.Router()`.

*   **`POST /api/auth/register`**: Creates a new user registration.
    *   Expects `username`, `password`, and optionally `role` fields in the request body (`req.body`).
    *   First, it checks if a user with the given `username` already exists. If so, it returns a `400 Bad Request` error.
    *   Creates a new `User` document. The password is automatically hashed thanks to the `pre('save')` method in the `User` model.
    *   Saves the user to the database.
    *   On successful registration, it returns a `201 Created` HTTP status and a confirmation message.
    *   Mongoose validation errors (e.g., password too short) or other server errors are handled appropriately.

*   **`POST /api/auth/login`**: Allows an existing user to log in and returns a JWT.
    *   Expects `username` and `password` fields in the request body.
    *   Searches for the user in the database with the given `username`. If the user is not found, it returns a `400 Bad Request` error.
    *   Compares the password entered by the user with the hashed password in the database via the `User` model's `comparePassword` method. If the passwords do not match, it returns a `400 Bad Request` error.
    *   If the credentials are correct, a JSON Web Token (JWT) is created using the `jsonwebtoken` library. This token contains a payload including the user `id`, `username`, and `role`. The token is signed with the `JWT_SECRET` defined in the `.env` file and set to be valid for a certain period (e.g., `1h` - 1 hour).
    *   On successful login, the generated `token` and basic user information (ID, username, role) are sent to the client in JSON format.

This file defines the `/api/auth/register` and `/api/auth/login` endpoints using Express.js Router. The `/register` endpoint handles the registration of new users (username, password, optional role); it checks if the username already exists, hashes the password (with the pre-save hook in the User model), and saves the user to the database. The `/login` endpoint allows existing users to log in; it finds the user, compares the entered password with the hash in the database, and upon successful authentication, generates and returns a JSON Web Token (JWT) containing the user ID, username, and role to the client. Error situations (e.g., user already exists, invalid credentials, server errors) are managed with appropriate HTTP status codes and messages.

The backend authentication infrastructure is completed with these steps. After configuring your `.env` file with the correct MongoDB URI and JWT Secret, you can run the backend server with the `npm install` and then `npm start` (or `npm run dev`) commands.

### Frontend Development

Next up is developing the React components for the user interface and interaction with the backend API on the frontend side.

#### 1. Authentication State Management (`frontend/src/context/AuthContext.js`)

The React Context API has been used to manage the user's authentication state (e.g., JWT token, user information) globally within the application and share it easily between components.

*   `AuthContext`: The context object created with `createContext`.
*   `useAuth()`: This hook provides easy access to the context.
*   `AuthProvider`: This component holds the context values (`token`, `user`, `login` function, `logout` function, `isAuthenticated` flag, `isLoading` flag) in its state and provides them to all its child components (`children`).
    *   `token` and `user` information are stored in the browser's `sessionStorage`. Thus, session information is preserved even if the page is refreshed.
    *   The `useEffect` hook is used to check `sessionStorage` when the application first loads, and any existing session information is loaded into the state.
    *   `login(newToken, newUserDetails)`: Called after a successful login. Saves the token and user details to the state and `sessionStorage`.
    *   `logout()`: Terminates the session, deleting the token and user information from the state and `sessionStorage`.
    *   `isLoading`: Used to prevent premature rendering of the interface or incorrect redirection while `sessionStorage` is being checked.

This React Context (`AuthContext`) file is used to manage authentication state across the application. It provides an `AuthProvider` component that manages `token`, user information (`user`), and `isLoading` states. `token` and `user` details are stored in the browser's `sessionStorage` and read from there when the application loads. The `login` function saves the token and user details to state and `sessionStorage` upon successful login, while the `logout` function clears this information. The `useAuth` hook provides easy access to context values (e.g., the `isAuthenticated` flag). The `isLoading` flag is used to manage the UI's state while data is being loaded from `sessionStorage`.

#### 2. Main Application Component and Routing (`frontend/src/App.js`)

This file defines the main component of the application (`App`) and sets up the page routing logic using `react-router-dom`. The entire application is wrapped with `AuthProvider` which manages the authentication state. Protected routes (`ProtectedRoute`) for logged-in users and public routes (`PublicRoute`) for users who are not logged in are defined. `ProtectedRoute` redirects unauthenticated users to the `/login` page, while `PublicRoute` prevents already logged-in users from accessing pages like `/login` again, redirecting them to the main page (`/home`). Along with basic routes for `/login` and `/home`, it includes a `NavigateToLandingPage` component that redirects users to the appropriate page based on their login status when undefined paths are accessed.

This file defines the main component (`App`) of the React application and sets up page routing logic using `react-router-dom`. The entire application is wrapped with `AuthProvider` to manage authentication state. Protected routes (`ProtectedRoute`) for logged-in users and public routes (`PublicRoute`) for users not logged in are defined. `ProtectedRoute` redirects unauthenticated users to the `/login` page, while `PublicRoute` prevents already logged-in users from re-accessing pages like `/login`, redirecting them to the home page (`/home`). Along with basic routes for `/login` and `/home`, it includes a `NavigateToLandingPage` component that redirects users to the appropriate page based on their login status when an undefined path is accessed.

#### 3. Authentication API Service (`frontend/src/services/authService.js`)

This file contains functions that enable the frontend application to communicate with the backend API for authentication operations (registration, login). The `axios` library is used to make HTTP requests.

*   **`API_URL`**: Holds the base address of the backend API (`http://localhost:5001/api/auth` or the address specified by the `REACT_APP_API_URL` environment variable).
*   **`register(username, password, role)`**: An asynchronous function.
    *   Sends a POST request to the backend's `/register` endpoint with the given username, password, and role.
    *   If successful, it returns the response from the backend (`{ message: '...', userId: '...' }`).
    *   If an error occurs (e.g., a network error or an error message from the backend), it catches this error and throws a more understandable error object.
*   **`login(username, password)`**: An asynchronous function.
    *   Sends a POST request to the backend's `/login` endpoint with the given username and password.
    *   If successful, it returns the response from the backend (`{ message: '...', token: '...', user: { ... } }`). This response is used by `AuthContext` to initiate the user's session.
    *   If an error occurs, it catches this error and throws a more understandable error object.

This service file uses `axios` to provide asynchronous functions (`register` and `login`) for the frontend application to communicate with the backend API. The `register` function sends a POST request to the `/api/auth/register` endpoint with a username, password, and role. The `login` function sends a POST request to the `/api/auth/login` endpoint with a username and password, and if successful, returns the response containing the token. Both functions handle API responses and potential errors.

#### 4. User Interface Components

##### a. Login Form (`frontend/src/components/LoginForm.js` and `LoginForm.css`)

This component creates an HTML form where users can enter their username and password.

*   **State Management:** Uses the `useState` hook to manage `username`, `password`, `error` (for error messages), and `loading` (to disable the button and provide user feedback during API requests) states.
*   **Context Access:** Retrieves the `login` function (renamed to `contextLogin`) from `AuthContext` using the `useAuth()` hook.
*   **Navigation:** Uses the `useNavigate` hook to redirect the user to the `/home` page after a successful login.
*   **Form Submission (`handleSubmit`):**
    *   When the form is submitted, it first clears any existing error message and sets the `loading` state to `true`.
    *   Calls the `authService.login(username, password)` function to send a login request to the backend.
    *   If successful (i.e., `data.token` and `data.user` are received), it calls the `contextLogin` function from `AuthContext` to update the global authentication state and redirects the user to the main page.
    *   If an error occurs, it updates the `error` state to display an error message to the user.
    *   Finally, it sets the `loading` state to `false`.
*   **Styling:** Basic styling is applied via `LoginForm.css`.

This React component creates a login form for users to input their username and password. It uses the `useState` hook for state management of form elements (`username`, `password`), error messages (`error`), and loading status (`loading`). It utilizes `useNavigate` for redirection after successful login and `useAuth` to access the authentication context. Upon form submission (`handleSubmit`), `authService.login` is called; if successful, `AuthContext` is updated, and the user is redirected to `/home`; otherwise, an error message is displayed. It's styled with a simple CSS file (`LoginForm.css`).

##### b. Login Page (`frontend/src/pages/LoginPage.js` and `LoginPage.css`)

This component is the page that includes the `LoginForm` component and is generally used as the application's login screen.

*   Renders a simple welcome message and the `LoginForm` component.
*   `LoginPage.css` provides the general layout and style for the page.

This React component creates the application's login page. It renders a simple title and footer, with the `LoginForm` component as the main content. The overall look and layout of the page are provided by the `LoginPage.css` file.

##### c. Home Page (`frontend/src/pages/HomePage.js` - defined in `App.js`)

This component is the protected main page to which the user is redirected after a successful login.

*   It includes a "Logout" button. When this button is clicked, the `logout` function from `AuthContext` is called, and the user is redirected to the `/login` page.

This React component is the protected home page displayed after a user successfully logs in. It uses the `useAuth` hook to access the current user information (`user`) and the `logout` function. It displays a personalized welcome message and the user's role. It also includes a "Logout" button that, when clicked, calls the `logout` function, terminating the session and redirecting the user to the `/login` page.

The basic authentication feature for Sprint 1 has been completed for both backend and frontend. Users can now register, log in, their sessions are maintained with `sessionStorage`, and they can access protected pages. A logout function is also available.

## Setup and Running Details

This section provides step-by-step instructions on how to set up and run the backend and frontend applications in your local environment and how to test the basic authentication functionalities.

### Prerequisites

*   **Node.js and npm:** You must have Node.js (LTS version recommended) and npm (comes with Node.js) installed on your system. You can download them from the [Node.js official website](https://nodejs.org/).
*   **MongoDB:** A local MongoDB server must be running, or you must have a MongoDB Atlas (cloud-based) cluster. Refer to the official documentation for [MongoDB installation](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
*   **Git (Optional):** You can use Git to clone the project.
*   **Postman (Optional but Recommended):** An API client like Postman will be useful for testing backend API endpoints (especially the registration process).

### 1. Obtaining the Project

If you are getting the project from a Git repository:

```bash
git clone <repository_url>
cd <project_folder_name>
```

If the project files are already available, navigate to the main project folder.

### 2. Backend Setup and Execution

Follow these steps while in the main project folder:

```bash
cd backend
```

*   **Install Dependencies:**
    ```bash
    npm install
    ```
    This command will install all backend dependencies listed in the `package.json` file (`express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `nodemon`).

*   **Configure Environment Variables (`.env` file):**
    Create a file named `.env` in the `backend` folder (if it doesn't exist). Add your MongoDB connection string and a secure JWT secret key to this file as shown below.

    **Using MongoDB Atlas (Recommended):**

    If you are using cloud-based MongoDB Atlas instead of a local MongoDB server ([https://cloud.mongodb.com/](https://cloud.mongodb.com/)), follow these steps:

    1.  **Create/Login Account:** Go to the MongoDB Atlas website and create an account or log in with your existing account.
    2.  **Create New Project:** You will usually be prompted to create a new "Project" or you can select an existing one.
    3.  **Create Cluster ("Build a Database"):**
        *   Click on "Build a Database" or "Create Cluster".
        *   In most cases, the **Free Tier (M0 Sandbox)** option offered under the "Shared" cluster type will be sufficient for starters. This comes with basic features and limited storage but is ideal for development and testing.
        *   Choose your cloud provider (AWS, Google Cloud, Azure) and a region. The region closest to you or with the lowest latency is generally preferred.
        *   Set your cluster name (e.g., `energy-management-cluster`).
        *   Click the "Create Cluster" button. Your cluster might take a few minutes to be created.
    4.  **Create Database User ("Database Access"):**
        *   After your cluster is created, go to the "Database Access" section under the "Security" heading in the left menu.
        *   Click the "Add New Database User" button.
        *   Set a username (e.g., `energyAppUser`) and a secure password. Note this password, as you will use it in the connection string.
        *   Select the permissions to be granted to the user. Usually, "Read and write to any database" (Built-in Role) or read/write permission to a specific database you create for your project (`readWrite@your_database_name`) will suffice. For starters, the "Atlas admin" role can also be granted.
        *   Click the "Add User" button.
    5.  **Configure Network Access ("Network Access"):**
        *   Go to the "Network Access" section under the "Security" heading in the left menu.
        *   Click the "Add IP Address" button.
        *   You need to specify where your application will access MongoDB Atlas from.
            *   **Quick solution for development:** You can use the "ALLOW ACCESS FROM ANYWHERE" option (IP address becomes `0.0.0.0/0`). Although this is not the best security practice, it is useful if your local machine's IP address changes frequently or if you don't want to deal with IP configuration initially. **Absolutely not recommended for production environments.**
            *   **More secure:** You can add your current public IP address using the "ADD CURRENT IP ADDRESS" option or manually enter specific IP addresses/ranges.
        *   Add a description and click the "Confirm" button. It might take some time for the IP address to become active.
    6.  **Get Connection String:**
        *   Return to your cluster overview page (Databases section).
        *   Click the "Connect" button next to your cluster.
        *   Select the "Drivers" (or "Connect your application") option.
        *   Choose "Node.js" as the driver and the appropriate version for you.
        *   A connection string specific to you will be displayed. This string usually looks like this:
            `mongodb+srv://<username>:<password>@<cluster-name>.<random-string>.mongodb.net/?retryWrites=true&w=majority&appName=<appName>`
        *   Copy this connection string.

    **Update `.env` File with MongoDB Atlas Connection String:**

    Replace the `MONGO_URI` variable in your `backend/.env` file with the connection string you obtained from MongoDB Atlas. Remember to replace `<username>` with the name of the database user you created in step 4, and `<password>` with that user's password. Also, it's good practice to add a database name to your connection string (if Atlas didn't add one by default). For example, if you want to use a database named `energyDB`, your connection string might look like this (usually added after `mongodb.net/` as `databaseName`):

    `MONGO_URI=mongodb+srv://energyAppUser:YOUR_PASSWORD_HERE@energy-management-cluster.xxxx.mongodb.net/energyDB?retryWrites=true&w=majority&appName=EnergyManagementCluster`

    If your connection string includes the `appName` parameter, this usually doesn't cause issues; you can leave it as is.

    **Using Local MongoDB (Alternative):**

    If you are using a local MongoDB server, the `MONGO_URI` in your `.env` file might be:

    `MONGO_URI=mongodb://localhost:27017/energy-management`
    (Here, `energy-management` is the name of the database you want to use. MongoDB will automatically create this database on the first connection.)

    **Other `.env` Variables:**

    ```env
    # MONGO_URI will be set according to the instructions above
    JWT_SECRET=your_super_secret_and_long_jwt_key_here
    PORT=5001
    ```
    *   `JWT_SECRET`: A very secret key used to sign and verify JSON Web Tokens. Choose a strong and hard-to-guess key.
    *   `PORT`: The port number on which the backend server will run (default 5001).

*   **Start the Backend Server:**
    In development mode (uses `nodemon` for automatic restarts on file changes):
    ```bash
    npm run dev
    ```
    Or for production mode (just with `node`):
    ```bash
    npm start
    ```
    You should see messages like "Successfully connected to MongoDB database." and "Backend server is running on port 5001..." in the console.

### 3. Frontend Setup and Execution

Open a new terminal while in the main project folder and follow these steps:

```bash
cd frontend
```

*   **Install Dependencies:**
    ```bash
    npm install
    ```
    This command will install all frontend dependencies listed in the `package.json` file (`react`, `react-dom`, `react-router-dom`, `axios`, `react-scripts`).

*   **Frontend Dependency Warnings and Security Vulnerabilities:**
    After running the `npm install` command, you might see many warnings starting with `npm warn deprecated` and a summary of security vulnerabilities at the end. For example:
    ```
    npm warn deprecated inflight@1.0.6: This module is not supported...
    ...
    8 vulnerabilities (2 moderate, 6 high)
    To address all issues (including breaking changes), run:
      npm audit fix --force
    Run `npm audit` for details.
    ```
    *   **Deprecated Warnings:** These warnings indicate that some packages your project uses directly or indirectly are outdated and no longer actively supported or have been replaced by newer packages/standards. Such warnings are common because tools like `create-react-app` (`react-scripts`) have a large dependency tree. They usually do not directly prevent your application from running but can lead to potential compatibility issues or security risks in the long run. At the Sprint 1 stage, resolving these warnings may not be a critical priority as long as your application runs.
    *   **Security Vulnerabilities:** npm warns you when it detects packages with known security vulnerabilities.
        1.  **Review Details:** You can get more information about security vulnerabilities by running the `npm audit` command. This command shows which packages are affected and the severity of the vulnerability.
        2.  **Automatic Fix (Be Careful!):**
            *   The `npm audit fix` command attempts to automatically fix known vulnerabilities. This command is generally safe and updates dependencies to compatible minor versions.
            *   If `npm audit fix` does not resolve all issues, npm sometimes suggests the `npm audit fix --force` command. **Be careful when using this command**, as the `--force` option can update package versions in a way that might introduce incompatible (breaking) changes and break your application. If you use this command, it's recommended to back up your code (commit your changes) beforehand.
    *   **Approach for Sprint 1:** As long as the basic authentication functionality works, these warnings and vulnerabilities are a secondary priority for Sprint 1. You can try the `npm audit fix` command. If your application continues to run smoothly, this might be sufficient. Use the `--force` option only if other methods don't work and you understand the risks. The important thing is that the frontend application starts and runs successfully with the `npm start` command.

*   **Start the Frontend Application:**
    ```bash
    npm start
    ```
    This command will start the React development server and open the application in your default browser (usually at `http://localhost:3000`). If the port is in use, it may start on a different port; check the message in the console.

### 4. Testing the Application

With the backend and frontend servers running, you can perform the following tests:

*   **a. New User Registration (via Backend API):**
    Since there isn't a registration form on the frontend yet, you will need to perform the first user registration via the backend API. Use Postman or a similar API testing tool:
    1.  **Request Type:** `POST`
    2.  **URL:** `http://localhost:5001/api/auth/register` (Update if your backend port is different)
    3.  **Headers:** `Content-Type` -> `application/json`
    4.  **Body (raw - JSON):**
        ```json
        {
          "username": "testuser",
          "password": "password123",
          "role": "user"
        }
        ```
        (You can use a different `username`, `password`, and `role` (`admin` or `technician` are also possible) if you wish.)
    5.  Send the request. If successful, you should receive a `201 Created` status and a response like `{"message":"User registered successfully.","userId":"..."}`.

*   **b. User Login (via Frontend Interface):**
    1.  Go to the address where your frontend application is running in your browser (e.g., `http://localhost:3000`).
    2.  In the form on the login page (`/login`), enter the `username` ("testuser") and `password` ("password123") you registered in the previous step.
    3.  When you click the "Login" button, if the login is successful, you should be redirected to the `/home` page. On this page, you should see messages like "Welcome, testuser!" and "Your role: user".
    4.  Open your browser's developer tools, go to the "Application" tab. From the left menu, click on `Session Storage` -> `http://localhost:3000` (or your application's address). You should see two keys named `token` and `user` and their assigned values. This indicates that the token and user information have been successfully stored.

*   **c. Incorrect Login Attempt:**
    1.  If you are on the `/home` page, log out by clicking the "Logout" button. You should be redirected to the `/login` page.
    2.  Enter an invalid username or password into the login form.
    3.  When you click the "Login" button, you should see an error message above the form (like "Invalid credentials...").

*   **d. Protected Page Access and Session Persistence:**
    1.  After successfully logging in (while on the `/home` page), close and reopen the browser tab and go to `http://localhost:3000`.
    2.  You should be redirected directly to the `/home` page (if `sessionStorage` is working correctly and the token is still valid).
    3.  Try to navigate to `http://localhost:3000/login` in the browser. Since you are logged in, you should be automatically redirected back to the `/home` page.

*   **e. Logging Out:**
    1.  While on the `/home` page, click the "Logout" button.
    2.  You should be redirected to the `/login` page.
    3.  Check `Session Storage` in the browser's developer tools. The `token` and `user` keys should have been deleted.
    4.  Now, if you try to access the `/home` page directly, you should be redirected to the `/login` page.

These steps will help you test whether the basic authentication functions developed in Sprint 1 are working correctly.

## Next Steps (For Other Sprints)

*   Creation of a user registration form and page (currently only a login form exists; registration can be done via API from the backend).
*   More detailed error handling and user feedback.
*   Forgot password / password reset feature.
*   Role-based authorization to control access to different pages and features based on user roles.
*   Implementation of form validation on the frontend side as well.

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