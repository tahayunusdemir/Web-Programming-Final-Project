# Comprehensive Testing Guide: Sprints 2 & 3

This document provides steps to test the functionalities implemented in Sprint 2 and Sprint 3 of the Energy Management System.

## I. Prerequisites

1.  **Servers Running:**
    *   Ensure the **Main Backend Server** is running (e.g., `npm start` or `npm run dev` in the `backend` directory, typically on `http://localhost:5001`).
    *   Ensure the **Mock Customer API Server** is running (e.g., `node mock-server.js` in the `mock-customer-api` directory, typically on `http://localhost:5002`).
    *   Ensure the **Frontend Development Server** is running (e.g., `npm start` in the `frontend` directory).
2.  **Database Setup (Manual Entry):**
    *   **Users:** The MongoDB database should have pre-populated users for each role with known credentials and IDs:
        *   Client: e.g., `username: clientUser`, `password: password123`, `role: 'client'`. Note its `_id`.
        *   Technician: e.g., `username: techUser`, `password: password123`, `role: 'technician'`. Note its `_id`.
        *   Operations Manager: e.g., `username: opsUser`, `password: password123`, `role: 'operationsManager'`. Note its `_id`.
    *   It is assumed that user registration is not a feature for these sprints, and these users are manually added to the `users` collection in MongoDB.
3.  **Required NPM Packages:**
    *   Run `npm install` in the `backend` directory.
    *   Run `npm install` in the `frontend` directory.
    *   Run `npm install` in the `mock-customer-api` directory.

## II. Authentication Tests (Covering All Sprints)

These tests ensure basic login, logout, and role-based access control foundations are working.

### A. Login Functionality
1.  **Test Case:** Valid Login - Client (VERIFIED)
    *   **Steps:**
        1.  Navigate to the login page (e.g., `/login`).
        2.  Enter credentials for a pre-populated 'client' user.
        3.  Click "Login".
    *   **Expected Result:** User is redirected to the home page (`/home`). The app bar displays "Energy Management System", a "REGISTER INSTALLATION" link, and a "LOGOUT" button. The main content area shows "This is your protected home page.".
2.  **Test Case:** Valid Login - Technician (VERIFIED)
    *   **Steps:**
        1.  Navigate to the login page.
        2.  Enter credentials for a pre-populated 'technician' user.
        3.  Click "Login".
    *   **Expected Result:** User is redirected to the home page (`/home`). The app bar displays "Energy Management System", a "REGISTER CERTIFICATE" link, and a "LOGOUT" button. The main content area shows "This is your protected home page.".
3.  **Test Case:** Valid Login - Operations Manager (VERIFIED)
    *   **Steps:**
        1.  Navigate to the login page.
        2.  Enter credentials for a pre-populated 'operationsManager' user.
        3.  Click "Login".
    *   **Expected Result:** User is redirected to the home page (`/home`). The app bar displays "Energy Management System", a "MONITOR PRODUCTION" link, and a "LOGOUT" button. The main content area shows "This is your protected home page.".
4.  **Test Case:** Invalid Login (VERIFIED)
    *   **Steps:**
        1.  Navigate to the login page.
        2.  Enter incorrect username or password (e.g., `sasdasd` / `......`).
        3.  Click "Login".
    *   **Expected Result:** An error message "Invalid credentials (user not found)." (or similar, matching the screenshot) is displayed within a red alert box on the login page. The user remains on the login page.

### B. Logout Functionality
1.  **Test Case:** Logout (VERIFIED)
    *   **Steps:**
        1.  Log in with any valid user.
        2.  Click the "Logout" button (usually in the navigation bar).
    *   **Expected Result:** User is redirected to the login page. Session/token is cleared.

## III. Sprint 2 Feature Tests

### A. Solar Panel Installation Registration (Client Role)

**User Role:** `client`

1.  **Test Case:** Access Control - Correct Role (VERIFIED)
    *   **Steps:**
        1.  Log in as a `client` user.
    *   **Expected Result:** The navigation bar should display a link/button like "Register Installation". Clicking it should lead to the installation registration form page (e.g., `/register-installation`).
2.  **Test Case:** Access Control - Incorrect Role (Technician) (VERIFIED)
    *   **Steps:**
        1.  Log in as a `technician` user.
    *   **Expected Result:** The "Register Installation" link/button should **not** be visible. Attempting to navigate directly to `/register-installation` should redirect to home or login, or show an unauthorized message.
3.  **Test Case:** Access Control - Incorrect Role (Operations Manager) (VERIFIED)
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
    *   **Expected Result:** The "Register Installation" link/button should **not** be visible. Attempting to navigate directly to `/register-installation` should redirect to home or login, or show an unauthorized message.
4.  **Test Case:** Successful Installation Registration (VERIFIED)
    *   **Steps:**
        1.  Log in as a `client` user.
        2.  Navigate to the "Register Installation" page.
        3.  Fill in all required fields (Address, City, Postal Code, Installation Date) and optionally other fields (Panel Model, Panel Count, Notes) with valid data.
        4.  Click the "Register Installation" button.
    *   **Expected Result:** A success message "Solar panel installation registered successfully. It is pending approval." is displayed. The form fields should clear or reset.
5.  **Test Case:** Installation Registration - Missing Required Fields (VERIFIED)
    *   **Steps:**
        1.  Log in as a `client` user.
        2.  Navigate to the "Register Installation" page.
        3.  Attempt to submit the form without filling in a required field (e.g., Address).
    *   **Expected Result:** An error message indicating the missing field is displayed. The form is not submitted.
6.  **Test Case:** Installation Registration - Invalid Data (e.g., incorrect date format if not handled by date picker, or negative panel count if validation exists) (VERIFIED)
    *   **Steps:**
        1.  Log in as a `client` user.
        2.  Navigate to the "Register Installation" page.
        3.  Enter invalid data in a field (e.g., text in "Number of Panels").
        4.  Click the "Register Installation" button.
    *   **Expected Result:** An appropriate error message is displayed. The form is not submitted.

### B. Certificate Registration (Technician Role)

**User Role:** `technician`

1.  **Test Case:** Access Control - Correct Role (VERIFIED)
    *   **Steps:**
        1.  Log in as a `technician` user.
    *   **Expected Result:** The navigation bar should display a link/button like "Register Certificate". Clicking it should lead to the certificate registration page (e.g., `/register-certificate`).
2.  **Test Case:** Access Control - Incorrect Role (Client) (VERIFIED)
    *   **Steps:**
        1.  Log in as a `client` user.
    *   **Expected Result:** The "Register Certificate" link/button should **not** be visible. Attempting to navigate directly to `/register-certificate` should redirect or show an unauthorized message.
3.  **Test Case:** Access Control - Incorrect Role (Operations Manager) (VERIFIED)
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
    *   **Expected Result:** The "Register Certificate" link/button should **not** be visible. Attempting to navigate directly to `/register-certificate` should redirect or show an unauthorized message.
4.  **Test Case:** User Search Functionality (VERIFIED)
    *   **Steps:**
        1.  Log in as a `technician` user.
        2.  Navigate to the "Register Certificate" page.
        3.  In the "Search and Select User" field, type a part of a known `client` user's username or name.
    *   **Expected Result:** A list of matching `client` users should appear in a dropdown.
    *   **Steps (continued):**
        4.  Select a user from the list.
    *   **Expected Result (continued):** The selected user's name/ID is displayed.
5.  **Test Case:** Successful Certificate Registration (VERIFIED)
    *   **Steps:**
        1.  Log in as a `technician` user.
        2.  Navigate to the "Register Certificate" page.
        3.  Search and select a valid `client` user.
        4.  Click "Upload Certificate (PDF)" and choose a valid `.pdf` file (less than 5MB).
        5.  Click the "Register Certificate" button.
    *   **Expected Result:** A success message like "Certificate registered successfully." is displayed. The form fields reset. The PDF file should be saved in the `backend/uploads/certificates/` directory.
6.  **Test Case:** Certificate Registration - No User Selected (VERIFIED)
    *   **Steps:**
        1.  Log in as a `technician` user.
        2.  Navigate to the "Register Certificate" page.
        3.  Select a `.pdf` file.
        4.  Attempt to click "Register Certificate" without selecting a user.
    *   **Expected Result:** An error message like "Please select a user and a certificate file." is displayed. The button might be disabled.
7.  **Test Case:** Certificate Registration - No File Selected (VERIFIED)
    *   **Steps:**
        1.  Log in as a `technician` user.
        2.  Navigate to the "Register Certificate" page.
        3.  Search and select a valid `client` user.
        4.  Attempt to click "Register Certificate" without selecting a file.
    *   **Expected Result:** An error message like "Certificate PDF file is required." or "Please select a user and a certificate file." is displayed. The button might be disabled.
8.  **Test Case:** Certificate Registration - Invalid File Type (VERIFIED)
    *   **Steps:**
        1.  Log in as a `technician` user.
        2.  Navigate to the "Register Certificate" page.
        3.  Search and select a valid `client` user.
        4.  Attempt to upload a non-PDF file (e.g., a `.txt` or `.jpg` file).
    *   **Expected Result:** An error message like "Only .pdf files are allowed!" is displayed when trying to submit, or the file selection dialog itself might restrict selection.
9.  **Test Case:** Certificate Registration - File Too Large (VERIFIED)
    *   **Steps:**
        1.  Log in as a `technician` user.
        2.  Navigate to the "Register Certificate" page.
        3.  Search and select a valid `client` user.
        4.  Attempt to upload a `.pdf` file larger than 5MB.
    *   **Expected Result:** An error message indicating the file is too large (e.g., "File upload error: File too large") is displayed.

## IV. Sprint 3 Feature Tests

### A. Renewable Energy Production Monitoring (Operations Manager Role)

**User Role:** `operationsManager`

1.  **Test Case:** Access Control - Correct Role (VERIFIED)
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
    *   **Expected Result:** The navigation bar should display a link/button like "Monitor Production". Clicking it should lead to the production monitoring page (e.g., `/production-monitoring`).
2.  **Test Case:** Access Control - Incorrect Role (Client) (VERIFIED)
    *   **Steps:**
        1.  Log in as a `client` user.
    *   **Expected Result:** The "Monitor Production" link/button should **not** be visible. Attempting to navigate directly to `/production-monitoring` should redirect or show an unauthorized message.
3.  **Test Case:** Access Control - Incorrect Role (Technician) (VERIFIED)
    *   **Steps:**
        1.  Log in as a `technician` user.
    *   **Expected Result:** The "Monitor Production" link/button should **not** be visible. Attempting to navigate directly to `/production-monitoring` should redirect or show an unauthorized message.
4.  **Test Case:** Fetch and Display Production Data for a Client
    *   **Prerequisites:** At least one `client` user exists in the database. The Mock Customer API is running and configured to return random KW data.
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
        2.  Navigate to the "Monitor Production" page.
        3.  The page should have a way to select a client (e.g., a dropdown listing clients, or an input for client ID). Select/enter a valid client.
        4.  Click a "Fetch Production" or similar button if present, or data might load automatically upon client selection.
    *   **Expected Result:** Energy production data (random KWs) for the selected client is displayed on the page. Verify the data appears to be dynamic (random values on refresh or re-fetch if applicable, due to the mock API).
5.  **Test Case:** Client Selection/Search (VERIFIED)
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
        2.  Navigate to the "Monitor Production" page.
    *   **Expected Result:** If there's a client dropdown, it should be populated with available client users. If it's a search/ID input, test its functionality.

### B. Develop Mock Customer API

*   **Implicit Test:** This API is tested indirectly when the "Renewable Energy Production Monitoring" feature successfully fetches and displays random KW data. This confirms the main backend can communicate with the mock API. (VERIFIED)
*   **Direct Test (Optional):** (VERIFIED)
    1.  Ensure the Mock Customer API server is running (e.g., on `http://localhost:5002` if configured).
    2.  Open a browser or API client (like Postman) and make a `GET` request to its `/production` endpoint (e.g., `http://localhost:5002/production`).
    *   **Expected Result:** The API should return a JSON response with random kilowatt values, for example: `{"kws": 45.67}`.

### C. Accounting for Energy Credits (Operations Manager Role)

**User Role:** `operationsManager`

*   **Status:** Implemented in Sprint 3.

1.  **Test Case:** Access Control - Correct Role (NEW)
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
    *   **Expected Result:** The navigation bar should display a link/button like "Manage Energy Credits". Clicking it should lead to the energy credits management page (e.g., `/energy-credits`).
2.  **Test Case:** Access Control - Incorrect Role (Client) (NEW)
    *   **Steps:**
        1.  Log in as a `client` user.
    *   **Expected Result:** The "Manage Energy Credits" link/button should **not** be visible. Attempting to navigate directly to `/energy-credits` should redirect to home or login, or show an unauthorized message.
3.  **Test Case:** Access Control - Incorrect Role (Technician) (NEW)
    *   **Steps:**
        1.  Log in as a `technician` user.
    *   **Expected Result:** The "Manage Energy Credits" link/button should **not** be visible. Attempting to navigate directly to `/energy-credits` should redirect to home or login, or show an unauthorized message.
4.  **Test Case:** Client Selection and Displaying Credits (NEW)
    *   **Prerequisites:** At least one `client` user exists. Some energy credits may or may not exist for this client.
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
        2.  Navigate to the "Manage Energy Credits" page.
        3.  Select a `client` user from the dropdown/selector.
    *   **Expected Result:** The page should display energy credit records for the selected client if any exist. If no credits exist, a message like "No energy credits found for this client" should be shown. The form to add new credits should be available.
5.  **Test Case:** Successfully Add New Energy Credit (NEW)
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
        2.  Navigate to the "Manage Energy Credits" page.
        3.  Select a `client` user.
        4.  Fill in "KWH Generated" (e.g., `150.75`).
        5.  Fill in "Credits Earned" (e.g., `15.08`).
        6.  Optionally, add notes.
        7.  Click the "Add Credit" button.
    *   **Expected Result:** A success message (e.g., "Energy credit created successfully!") is displayed. The form fields reset. The new credit record appears in the list for the selected client.
6.  **Test Case:** Add New Energy Credit - Missing Required Fields (NEW)
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
        2.  Navigate to the "Manage Energy Credits" page.
        3.  Select a `client` user.
        4.  Leave "KWH Generated" or "Credits Earned" blank.
        5.  Click the "Add Credit" button.
    *   **Expected Result:** An error message (e.g., "Please select a client and fill in KWH Generated and Credits Earned.") is displayed. The credit is not added.
7.  **Test Case:** Edit Existing Energy Credit (NEW)
    *   **Prerequisites:** At least one energy credit record exists for a client.
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
        2.  Navigate to the "Manage Energy Credits" page.
        3.  Select the `client` user who has an energy credit.
        4.  In the list of credits, click the "Edit" icon for a specific credit.
        5.  The form should populate with the selected credit's data.
        6.  Modify "KWH Generated" (e.g., to `200.5`) and/or "Credits Earned" (e.g., to `20.05`) or notes.
        7.  Click the "Update Credit" button.
    *   **Expected Result:** A success message (e.g., "Energy credit updated successfully!") is displayed. The form fields reset. The credit record in the list is updated with the new values.
8.  **Test Case:** Delete Energy Credit (NEW)
    *   **Prerequisites:** At least one energy credit record exists for a client.
    *   **Steps:**
        1.  Log in as an `operationsManager` user.
        2.  Navigate to the "Manage Energy Credits" page.
        3.  Select the `client` user who has an energy credit.
        4.  In the list of credits, click the "Delete" icon for a specific credit.
        5.  Confirm the deletion when prompted (e.g., by a browser confirm dialog).
    *   **Expected Result:** A success message (e.g., "Energy credit deleted successfully!") is displayed. The credit record is removed from the list.

## V. Postman API Testing (Backend)

This section details how to test the backend API endpoints directly using Postman. Replace placeholder values like `{{CLIENT_USER_ID}}`, `{{TECH_USER_TOKEN}}`, etc., with actual values obtained during your testing (e.g., after logging in a user via Postman to get a token).

**Base URL for Main Backend:** `http://localhost:5001/api`
**Base URL for Mock API:** `http://localhost:5002`

### A. Authentication (`/auth`)

1.  **Login User**
    *   **Method:** `POST`
    *   **URL:** `{{baseURL}}/auth/login`
    *   **Body:** `raw` (JSON)
        ```json
        {
          "username": "clientUser", // or techUser, opsUser
          "password": "password123"
        }
        ```
    *   **Expected Status:** `200 OK`
    *   **Expected Body (Example):**
        ```json
        {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT Token
          "user": {
            "id": "actual_user_id_from_db",
            "username": "clientUser",
            "role": "client"
          }
        }
        ```
    *   **Note:** Save the `token` from the response for subsequent authenticated requests. Also, note the `id` for the logged-in user.

### B. Solar Panel Installations (`/installations`)

_Requires Client Authentication Token (`{{CLIENT_USER_TOKEN}}`)_ 
_Replace `{{CLIENT_USER_ID_FROM_LOGIN}}` with the ID of the logged-in client user._

1.  **Register New Installation**
    *   **Method:** `POST`
    *   **URL:** `{{baseURL}}/installations/register`
    *   **Headers:**
        *   `Authorization`: `Bearer {{CLIENT_USER_TOKEN}}`
        *   `Content-Type`: `application/json`
    *   **Body:** `raw` (JSON)
        ```json
        {
          "address": "123 Solar St",
          "city": "Sunville",
          "postalCode": "12345",
          "panelModel": "SunPower X22",
          "panelCount": 10,
          "installationDate": "2024-07-15",
          "notes": "Installation on south-facing roof."
        }
        ```
    *   **Expected Status:** `201 Created`
    *   **Expected Body (Example):**
        ```json
        {
          "message": "Solar panel installation registered successfully. It is pending approval.",
          "installation": {
            "clientId": "{{CLIENT_USER_ID_FROM_LOGIN}}",
            "address": "123 Solar St",
            // ... other fields ...
            "_id": "actual_installation_id",
            "createdAt": "...",
            "updatedAt": "..."
          }
        }
        ```

### C. Certificates (`/certificates`)

_Requires Technician Authentication Token (`{{TECH_USER_TOKEN}}`) for registration._
_Requires Technician or Ops Manager Token for search._
_Replace `{{CLIENT_USER_ID_FOR_CERT}}` with the ID of an existing client user._

1.  **Search Users (Clients) to Assign Certificate**
    *   **Method:** `GET`
    *   **URL:** `{{baseURL}}/certificates/search?query=clientUser` (or part of username, or empty for all clients)
    *   **Headers:**
        *   `Authorization`: `Bearer {{TECH_USER_TOKEN}}` (or `{{OPS_MANAGER_TOKEN}}`)
    *   **Expected Status:** `200 OK`
    *   **Expected Body (Example for specific query):**
        ```json
        [
          {
            "id": "{{CLIENT_USER_ID_FOR_CERT}}",
            "username": "clientUser",
            "name": "clientUser" // or actual name if set
          }
        ]
        ```

2.  **Register New Certificate (with File Upload)**
    *   **Method:** `POST`
    *   **URL:** `{{baseURL}}/certificates/register`
    *   **Headers:**
        *   `Authorization`: `Bearer {{TECH_USER_TOKEN}}`
        *   (Postman handles `Content-Type: multipart/form-data` automatically when using form-data body)
    *   **Body:** `form-data`
        *   `userId`: `{{CLIENT_USER_ID_FOR_CERT}}` (Text)
        *   `userName`: `clientUser` (Text - username of the client)
        *   `certificateFile`: (File - Select a PDF file from your system)
    *   **Expected Status:** `201 Created`
    *   **Expected Body (Example):**
        ```json
        {
          "message": "Certificate registered successfully.",
          "certificate": {
            "userId": "{{CLIENT_USER_ID_FOR_CERT}}",
            "userName": "clientUser",
            "certificateFile": "backend/uploads/certificates/{{CLIENT_USER_ID_FOR_CERT}}-<timestamp_randomNumber>.pdf", // Actual path
            "issuedBy": "{{LOGGED_IN_TECH_USER_ID}}",
            "originalFileName": "your_test_file.pdf",
            "_id": "actual_certificate_id",
            // ... timestamps ...
          }
        }
        ```

### D. Production Monitoring (`/production`)

_Requires Operations Manager Authentication Token (`{{OPS_MANAGER_TOKEN}}`)_ 
_Replace `{{TARGET_CLIENT_ID}}` with the ID of an existing client user._

1.  **Get Production Data for a Specific Client**
    *   **Method:** `GET`
    *   **URL:** `{{baseURL}}/production/{{TARGET_CLIENT_ID}}`
    *   **Headers:**
        *   `Authorization`: `Bearer {{OPS_MANAGER_TOKEN}}`
    *   **Expected Status:** `200 OK`
    *   **Expected Body (Example, data from Mock API):**
        ```json
        {
          "kws": 78.12 // Random value from mock API
        }
        ```

2.  **Get All Clients (for Operations Manager to select from - if this endpoint exists on production route or a general user route)**
    *   The production monitoring page uses `getAllClients` which calls `GET /api/certificates/search` (if Ops Manager is allowed, which it is).
    *   **See Test C.1 (`Search Users (Clients)`)** - Use Ops Manager token.

### E. Mock Customer API (`/production`)

1.  **Get Random Production Data**
    *   **Method:** `GET`
    *   **URL:** `{{mockApiBaseURL}}/production` (e.g., `http://localhost:5002/production`)
    *   **Expected Status:** `200 OK`
    *   **Expected Body (Example):**
        ```json
        {
          "kws": 33.5 // Random value
        }
        ```

### F. Energy Credits (`/energy-credits`) (NEW)

_Requires Operations Manager Authentication Token (`{{OPS_MANAGER_TOKEN}}`) for all endpoints._
_Replace `{{TARGET_CLIENT_ID_FOR_CREDITS}}` with the ID of an existing client user._
_Replace `{{EXISTING_CREDIT_ID}}` with the ID of an existing energy credit record after creating one._

1.  **Create New Energy Credit**
    *   **Method:** `POST`
    *   **URL:** `{{baseURL}}/energy-credits`
    *   **Headers:**
        *   `Authorization`: `Bearer {{OPS_MANAGER_TOKEN}}`
        *   `Content-Type`: `application/json`
    *   **Body:** `raw` (JSON)
        ```json
        {
          "clientId": "{{TARGET_CLIENT_ID_FOR_CREDITS}}",
          "kwhGenerated": 120.5,
          "creditsEarned": 12.05,
          "notes": "Monthly credit calculation"
        }
        ```
    *   **Expected Status:** `201 Created`
    *   **Expected Body (Example):**
        ```json
        {
          "clientId": "{{TARGET_CLIENT_ID_FOR_CREDITS}}",
          "kwhGenerated": 120.5,
          "creditsEarned": 12.05,
          "notes": "Monthly credit calculation",
          "_id": "actual_credit_id",
          "calculationDate": "...",
          "createdAt": "...",
          "updatedAt": "..."
        }
        ```
    *   **Note:** Save the `_id` of the created credit as `{{EXISTING_CREDIT_ID}}` for subsequent tests.

2.  **Get Energy Credits for a Specific Client**
    *   **Method:** `GET`
    *   **URL:** `{{baseURL}}/energy-credits/client/{{TARGET_CLIENT_ID_FOR_CREDITS}}`
    *   **Headers:**
        *   `Authorization`: `Bearer {{OPS_MANAGER_TOKEN}}`
    *   **Expected Status:** `200 OK`
    *   **Expected Body (Example - Array of credits):**
        ```json
        [
          {
            "clientId": "{{TARGET_CLIENT_ID_FOR_CREDITS}}",
            "kwhGenerated": 120.5,
            // ... other fields
            "_id": "{{EXISTING_CREDIT_ID}}"
          }
        ]
        ```

3.  **Get Specific Energy Credit by ID**
    *   **Method:** `GET`
    *   **URL:** `{{baseURL}}/energy-credits/{{EXISTING_CREDIT_ID}}`
    *   **Headers:**
        *   `Authorization`: `Bearer {{OPS_MANAGER_TOKEN}}`
    *   **Expected Status:** `200 OK`
    *   **Expected Body (Example):**
        ```json
        {
          "clientId": {
             "_id": "{{TARGET_CLIENT_ID_FOR_CREDITS}}",
             "username": "clientUser",
             // ... other populated client fields
          },
          "kwhGenerated": 120.5,
          // ... other fields
          "_id": "{{EXISTING_CREDIT_ID}}"
        }
        ```

4.  **Update Existing Energy Credit**
    *   **Method:** `PUT`
    *   **URL:** `{{baseURL}}/energy-credits/{{EXISTING_CREDIT_ID}}`
    *   **Headers:**
        *   `Authorization`: `Bearer {{OPS_MANAGER_TOKEN}}`
        *   `Content-Type`: `application/json`
    *   **Body:** `raw` (JSON)
        ```json
        {
          "kwhGenerated": 130.0,
          "creditsEarned": 13.00,
          "notes": "Updated credit calculation for the month"
        }
        ```
    *   **Expected Status:** `200 OK`
    *   **Expected Body (Example - updated credit):**
        ```json
        {
          "clientId": "{{TARGET_CLIENT_ID_FOR_CREDITS}}", // or populated client object depending on PUT response
          "kwhGenerated": 130.0,
          "creditsEarned": 13.00,
          "notes": "Updated credit calculation for the month",
          "_id": "{{EXISTING_CREDIT_ID}}",
          // ... other fields, updatedAt should be recent
        }
        ```

5.  **Delete Energy Credit**
    *   **Method:** `DELETE`
    *   **URL:** `{{baseURL}}/energy-credits/{{EXISTING_CREDIT_ID}}`
    *   **Headers:**
        *   `Authorization`: `Bearer {{OPS_MANAGER_TOKEN}}`
    *   **Expected Status:** `200 OK`
    *   **Expected Body (Example):**
        ```json
        {
          "message": "Energy credit record removed successfully"
        }
        ```

---

**Notes for Testers:**
*   Pay attention to console logs in the browser (Developer Tools) and the terminal output for both backend servers for any errors.
*   For role-based access tests, ensure that after logging out as one role and logging in as another, the UI correctly reflects the new role's permissions.
*   The exact URLs, button texts, and success/error messages might vary slightly from this guide based on implementation details. Adapt as needed.
