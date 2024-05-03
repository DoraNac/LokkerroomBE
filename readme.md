Lokkerroom backend -

This backend serves as the server-side component for a chatroom application. It provides functionality for user registration, authentication, and lobby management.



Technologies Used -

Express: Web application framework for Node.js.
PostgreSQL (pg): PostgreSQL client for Node.js to interact with the database.
JWT (JSON Web Tokens): For user authentication and authorization.
dotenv: For loading environment variables from a .env file.
cors: Middleware for enabling Cross-Origin Resource Sharing.



API Endpoints -

POST /api/register: Register a new user. Requires email and password in the request body.
POST /api/login: Log in an existing user. Requires email and password in the request body. Returns a JWT token upon successful login.
POST /api/lobby: Create a new lobby. Requires admin_id and lobbyName in the request body. Requires a valid JWT token in the Authorization header for authentication.



Authentication -

This backend uses JWT (JSON Web Tokens) for user authentication. Upon successful login, a JWT token is generated and returned in the response.
To access protected routes (like creating a lobby), clients must include the JWT token in the Authorization header.



Author

[DoraNac] (Dora Nacinovic)
