# Project TODO List

Based on `Trabalho_Final_PW.md`.

## Phase 1: Project Setup & Administration

-   [x] **Group Formation:**
    -   [x] Form a group of 4 or fewer students.
    -   [x] Register the group on the specified Discord channel.
-   [x] **Repository Setup:**
    -   [x] Create a private GitHub repository.
    -   [x] Add the practical class instructor as a collaborator to the repository.
-   [x] **Sprint Planning:**
    -   [x] Plan out the sprints.
    -   [x] Assign a Product Owner for each sprint, ensuring rotation among group members.

## Phase 2: Functional Requirements Implementation

### **Authentication (Sprint 1)**
-   [x] **Backend:**
    -   [x] Set up a MongoDB collection to store user credentials (no registration feature needed).
    -   [x] Create a backend API endpoint to handle login requests.
    -   [x] Implement credential validation against the MongoDB collection.
    -   [x] Generate a JSON Web Token (JWT) upon successful login.
    -   [x] The JWT payload must include the user's identity and role for authorization.
    -   [x] Return the generated token to the client.
-   [x] **Frontend:**
    -   [x] Create a login form using Material-UI components (e.g., TextField, Button) for users to enter their credentials.
    -   [x] On form submission, send credentials to the backend API.
    -   [x] Upon receiving the token, store it securely (e.g., in `sessionStorage` or a cookie).
    -   [x] Implement logic to use the stored token to protect application features and authorize access based on user role.

### **Solar Panel Installation & Certificate Management (Sprint 2)**

#### **Client-Side: Installation Registration**
-   [x] Restrict access to this feature to users with the "Client" role.
-   [x] Pre-populate the database with client data (no client registration feature needed).
-   [x] Develop a form using Material-UI components for clients to register their solar panel installations, including technical data and location.
-   [x] Save the submitted installation data to the database, linked to the client's account.

#### **Technician-Side: Certificate Validation and Upload**
-   [x] Restrict access to this feature to users with the "Technician" role.
-   [x] Create an interface with Material-UI components (e.g., DataGrid, Card) for technicians to view and manage installation records.
-   [x] Implement a way for technicians to search for user/installation records by ID and name.
-   [x] Create a workflow for a certified technician to validate the installation details.
-   [x] Develop a feature to upload an energy producer certificate (.pdf file) for the validated installation.
-   [x] Store the certificate and associate it with the correct user and installation in the database.
-   [x] Ensure certificates are recorded and accessible within the application.
-   [x] Implement an automated email service to notify customers monthly about their generated energy.

### **Energy Monitoring & Credit Accounting (Sprint 3)**
-   This entire feature set should only be accessible to users with the 'Operations Manager' role.

#### **1. Mock Customer API (Separate Node.js Service)**
-   [x] Set up a separate Node.js project to act as the mock Customer API.
-   [x] Create a `GET /production` endpoint within this service.
-   [x] Implement logic for this endpoint to generate and respond with a random number representing kilowatt (kW) production.

#### **2. Main Backend Application**
-   [x] **Production Monitoring Endpoint:**
    -   [x] Create a main backend endpoint, `/production/{idClient}`, to handle requests from the frontend.
    -   [x] Secure this endpoint so only 'Operations Manager' roles can access it.
    -   [x] When called, this endpoint should make a `GET` request to the mock Customer API's `/production` endpoint.
    -   [x] Store the received random kW value in the MongoDB database, associating it with the `idClient`.
-   [x] **Energy Credit Accounting:**
    -   [x] Implement a process (e.g., automated monthly job or a manual trigger for the manager) for accounting.
    -   [x] This process should calculate the energy produced versus the energy consumed (if consumption data is available; otherwise, use a placeholder).
    -   [x] Convert the surplus energy into credits (e.g., 1 kWh = 1 credit).
    -   [x] Update customer records with these credits for future bill offsets.
    -   [x] Implement an automated email service to notify customers monthly about their generated energy.

#### **3. Frontend Application**
-   [x] Develop a UI view/dashboard using Material-UI components for the 'Operations Manager'.
-   [x] This UI should allow the manager to trigger the `/production/{idClient}` request to monitor a client's energy production.
-   [x] Display the retrieved energy production data on the dashboard.

## Phase 3: Non-Functional Requirements Checklist

-   [ ] **Usability:** Design an intuitive and easy-to-use interface for both company employees and customers.
-   [ ] **Performance:** Ensure the system can process large amounts of data in real-time with fast and efficient responses.
-   [ ] **Security:** Implement robust security measures to protect all customer and company data from unauthorized access.
-   [ ] **Scalability:** Architect the system to handle a growing number of users and allow for the integration of new features in the future.
-   [ ] **Availability:** Ensure the system is available 24/7 for continuous access.
-   [ ] **Compatibility:** The application must be compatible with various devices and platforms, including desktops, tablets, and smartphones.
-   [ ] **Maintainability:** Write clean, organized, and well-documented code to facilitate easy error correction and addition of new functionalities.

## Phase 4: Sprint and Final Delivery

### **Sprint Delivery Rules**
-   [x] Complete all tasks for each sprint by the scheduled dates.
-   [x] The Product Owner for the sprint is responsible for committing the new version of the code with the message `Sprint n`.
-   [x] The Product Owner will defend the sprint's work in the class following its completion (max. 5-minute presentation).
-   [x] All group members must be present at the sprint presentation to receive a grade.

### **Final Project Delivery**
-   [x] Prepare a final report with the following structure:
    -   [x] **Introduction:** A general description of the developed application.
    -   [x] **Implementation:** An explanation of the most important parts of the implemented solution.
    -   [x] **Conclusion:** An analysis of the solution, including its limitations, potential improvements, and future functionalities.
-   [x] Package the complete project code and the final report into a single compressed file (ZIP/RAR).
-   [x] Submit the file on the Moodle platform by the deadline.

## Evaluation Criteria (For Reference)
-   [ ] Volume of work produced in class (10%)
-   [ ] Continuous work throughout the project (20%)
-   [ ] Creativity (10%)
-   [ ] Capacity to exceed objectives (20%)
-   [ ] Code quality (10%)
-   [ ] Complexity of the developed work (20%)
-   [ ] Report (10%)
-   [ ] Defense of the work (cross-cutting factor)
