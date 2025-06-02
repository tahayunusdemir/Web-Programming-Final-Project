# TODO List - Authentication Feature

## Frontend Tasks

1.  **Create Authentication Form:** [DONE]
    *   Design and implement a user interface for login.
    *   Include input fields for username/email and password.
    *   Add a submit button to send credentials to the backend.

2.  **Handle API Response and Token Storage:** [DONE]
    *   Implement logic to receive the authentication token from the backend API upon successful login.
    *   Store the received token securely, either in `sessionStorage` or a cookie.
    *   Ensure the token includes user identity and role for authorization purposes.

## Backend Tasks

1.  **Implement Credential Validation API Endpoint:** [DONE]
    *   Create an API endpoint (e.g., `/api/auth/login`) to receive user credentials (username/email and password).
    *   Validate the received credentials against the user data stored in the database.

2.  **Set up User Credential Storage (MongoDB):** [DONE]
    *   Configure a MongoDB database and a collection to store user credentials.
    *   Since user registration is not required for this sprint, pre-populate the collection with necessary user data (including username/email, password, identity, and role).

3.  **Generate and Return Authentication Token:** [DONE]
    *   Upon successful credential validation, generate a secure authentication token (e.g., JWT).
    *   The token must include essential user information: identity (e.g., user ID) and role (e.g., 'admin', 'user').
    *   Return the generated token to the client in the API response.

## TODO List - Sprint 2 Features

### Solar Panel Installation Registration (Client Role)

1.  **Develop Frontend Interface for Installation Registration:** [DONE]
    *   Create a form for clients to register their solar panel installations. (Implemented `InstallationRegistrationForm.js` and `InstallationRegistrationPage.js`) [DONE]
    *   Ensure this interface is only accessible to users with the 'Client' role. (Implemented `ClientProtectedRoute` in `App.js`) [DONE]
    *   Input fields should capture all necessary details about the installation. (Form includes fields for address, city, postal code, panel details, date, notes) [DONE]

2.  **Implement Backend API for Installation Registration:** [DONE]
    *   Create an API endpoint to receive and store solar panel installation data. (Implemented `POST /api/installations/register` in `backend/routes/installations.js`) [DONE]
    *   Protect this endpoint to ensure only users with the 'Client' role can access it. (Implemented `clientAuthMiddleware`) [DONE]
    *   Store installation data in the database, linking it to the respective client. (Implemented `Installation` model and saving logic) [DONE]

3.  **Client Data Management (Manual Entry):** [TODO] <!-- User to verify -->
    *   Client data (including their 'Client' role) will be entered directly into the database for this sprint. No separate client registration feature is needed.

### Certificate Registration (Technician Role)

1.  **Develop Frontend Interface for Certificate Upload:** [DONE]
    *   Create an interface for certified technicians to upload certificates. [DONE]
    *   This interface should only be accessible to users with the 'Technician' role. [DONE]
    *   Include functionality to search for a user record by ID and name. [DONE]
    *   Implement a file upload component for `.pdf` certificate files. [DONE]

2.  **Implement Backend API for Certificate Upload and User Search:** [DONE]
    *   Create an API endpoint to handle certificate uploads and associate them with a user. [DONE]
    *   Protect this endpoint for 'Technician' role access. [DONE]
    *   Implement API functionality to search for user records by ID and name. [DONE]
    *   Handle `.pdf` file uploads, store them appropriately (e.g., in a designated folder or as a blob in the DB), and link them to the user. [DONE]

3.  **Technician Data Management (Manual Entry):** [TODO] <!-- User to verify -->
    *   Technician data (including their 'Technician' role) will be entered directly into the database.

## TODO List - Sprint 3 Features

### Renewable Energy Production Monitoring (Operations Manager Role)

1.  **Develop Frontend Interface for Production Monitoring:** [DONE]
    *   Create a user interface for Operations Managers to monitor renewable energy production.
    *   This interface should only be accessible to users with the 'Operations Manager' role.
    *   It should allow specifying a `idClient` to view their production data.
    *   Display the energy production data (random KWs from mock API) received from the backend.

2.  **Implement Main Backend API for Production Data:** [LARGELY DONE - Core functionality implemented; specific logging/storage of readings to main DB might be pending/clarified]
    *   Create an API endpoint (e.g., `/production/{idClient}`) that the frontend can call.
    *   Protect this endpoint to ensure only 'Operations Manager' role can access it.
    *   This endpoint will make a `GET /production` request to the Mock Customer API.
    *   It will then relay the (random KWs) data from the Mock API back to the frontend.
    *   Integrate with MongoDB for any necessary data storage or retrieval related to this feature (e.g., logging requests, associating data with clients if needed beyond mock data).

3.  **Develop Mock Customer API:** [DONE]
    *   Create a separate Node.js server to act as the Mock Customer API.
    *   Implement a `GET /production` endpoint on this mock server.
    *   This endpoint should return random kilowatt values (KWs) to simulate energy readings.

4.  **Operations Manager Data Management (Manual Entry):** [DONE]
    *   Operations Manager user data (including their 'Operations Manager' role) will be entered directly into the database.

### Accounting for Energy Credits (Operations Manager Role)

1.  **Define Logic for Energy Credit Calculation:** [DONE - Basic calculation implemented, assuming kwhGenerated and creditsEarned are provided directly. More complex logic can be added later if needed.]
    *   Specify how energy credits will be calculated based on the production data. (Further details/logic for this might be needed).
2.  **Develop Frontend Interface for Energy Credit Viewing/Management:** [DONE]
    *   Create a UI for Operations Managers to view and/or manage energy credits.
    *   This interface should only be accessible to users with the 'Operations Manager' role.
3.  **Implement Backend API for Energy Credits:** [DONE]
    *   Create API endpoints for calculating, storing, and retrieving energy credit information.
    *   Protect these endpoints for 'Operations Manager' role access.
    *   Integrate with the database (MongoDB) to store energy credit data. 