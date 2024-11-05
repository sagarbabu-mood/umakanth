const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");
const fetch = require("node-fetch"); // Ensure node-fetch is included
const app = express();

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "addusers.db");
let db;

// Initialize Database
const initializeDB = () => {
  try {
    db = new Database(dbPath);
    console.log("Connected to the SQLite database.");
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDB();

// Start Server
app.listen(3001, () => {
  console.log("Server running at http://localhost:5001/");
});

// Signup Route
app.post("/signup", (req, res) => {
  try {
    const { username, email, password } = req.body;

    const selectUserQuery = `SELECT * FROM users WHERE username = ?;`;
    const dbUser = db.prepare(selectUserQuery).get(username);

    if (!dbUser) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const addUserQuery = `
                INSERT INTO users (username, password, email)
                VALUES (?, ?, ?);`;
      db.prepare(addUserQuery).run(username, hashedPassword, email);
      res.status(201).send("User added successfully");
    } else {
      res.status(400).send("User already exists");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  try {
    const selectUserQuery = `SELECT * FROM users WHERE username = ?;`;
    const dbUser = db.prepare(selectUserQuery).get(username);

    if (!dbUser) {
      return res.status(400).json({ message: "Invalid User!" });
    }

    const isPasswordMatched = bcrypt.compareSync(password, dbUser.password);

    if (isPasswordMatched) {
      return res.status(200).json({ message: "Login Successful!" });
    } else {
      return res.status(400).json({ message: "Invalid Password!" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// News API Key and URL
const NEWS_API_KEY = "1c7a0e85df864762a9efaf86529ed9b9";
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${NEWS_API_KEY}`;

// Fetch News Route
app.get("/api/news", async (req, res) => {
  try {
    const response = await fetch(NEWS_API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const articles = data.articles.map((article) => ({
      image: article.urlToImage,
      headline: article.title,
      summary: article.description,
      link: article.url,
    }));
    res.json(articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Error fetching news" });
  }
});
