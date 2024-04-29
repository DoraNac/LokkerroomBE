const express = require("express");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sports_club_platform",
  password: "mjaumjau",
  port: 5432,
});

const jwtSecret = "your-secret-key";

function generateToken(users) {
  const payload = {
    userId: users.userID,
    email: users.email,
  };

  const token = jwt.sign(payload, "your-secret-key", { expiresIn: "2h" });

  return token;
}
app.get("/", (req, res) => {
  res.send("helooo");
});
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Invalid request" });
    }

    const queryText = "INSERT INTO users (email, password) VALUES ($1, $2)";
    const values = [email, password];
    await pool.query(queryText, values);

    res.json({ message: "User has been created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const queryText = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(queryText, [email]);

    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    const token = generateToken(user);
    const login = "login successful";
    res.json({ login, token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.use(async (req, res, next) => {
//   console.log("Middleware called");
//   if (!req.headers.authorization) return res.status(401).send("Unauthorized");

//   try {
//     const decoded = await verify(
//       req.headers.authorization.split(" ")[1],
//       jwtSecret
//     );

//     if (decoded !== undefined) {
//       req.user = decoded;
//       return next();
//     }
//   } catch (err) {
//     console.log(err);
//   }

//   return res.status(403).send("Invalid token");
// });

app.post("/api/lobby", async (req, res) => {
  try {
    const { admin_id, lobbyName } = req.body;
    console.log(admin_id, lobbyName);
    if (!admin_id || !lobbyName) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const queryText =
      "INSERT INTO lobby (adminID, lobbyName) VALUES ($1, $2) RETURNING lobbyID";
    const values = [admin_id, lobbyName];
    const { rows } = await pool.query(queryText, values);
    console.log(rows);
    if (rows[0] && rows[0].lobbyid) {
      lobbyID = rows[0].lobbyid.toString();
    } else {
      return res.status(500).json({ error: "Failed to create lobby" });
    }

    res.json({
      message: "Lobby created successfully",
      lobbyID: lobbyID,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});