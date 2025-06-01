# Sprint 3: Implementation of Renewable Energy Production Monitoring

This functionality should only be accessible to users associated with the 'Operations Manager' role.

Customer data must be read from a Mock API that provides random numbers representative of the readings.

This functionality should only be accessible to users associated with the 'Operations Manager' role.

## System Architecture

The system architecture consists of the following components and interactions:

1.  **Frontend (HTML+CSS+JS):** The client-side application initiates a request to the backend. Specifically, it sends a request to the `/production/{idClient}` endpoint.
2.  **Main Backend (Node.JS Server):**
    *   Receives the `/production/{idClient}` request from the frontend.
    *   Interacts with a **MongoDB** database for data storage and retrieval.
    *   Makes a `GET /production` request to a mock Customer API to fetch energy production data.
3.  **Customer API (Mock Node.JS Server):**
    *   This is a separate mock service.
    *   It receives the `GET /production` request from the main Node.JS server.
    *   It responds with random kilowatt values (kws (Random)) to simulate energy readings from a customer's system.
    *   The main Node.JS server receives these random kilowatt values from the Customer API.

```mermaid
sequenceDiagram
    participant Client [HTML+CSS+JS]
    participant MainServer [Node.JS Server]
    participant MockAPI [Customer API (Mock) Node.JS]
    participant DB [MongoDB]

    Client->>MainServer: /production/{idClient}
    MainServer->>DB: Store/Retrieve Data
    MainServer->>MockAPI: GET /production
    MockAPI-->>MainServer: kws (Random)
``` 