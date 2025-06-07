# Creation of Authentication Feature (Frontend+Backend)

## Workflow

1.  The user enters their credentials into the form.
2.  The backend API must validate the credentials in the database. It is not necessary to implement a user registration feature, so credentials should be stored in a MongoDB collection.
3.  The API generates a token and returns it to the client. The token must contain the user's identity and role to authorize access to application features.
4.  The authentication token can be stored in sessionStorage or a cookie.