const express = require('express');
const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "addusers.db");
let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(5001, () => {
            console.log("Server Running at http://localhost:5001/");
        });
    } catch (e) {
        console.error(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

// Signup Route
app.post("/signup", async (request, response) => {
    try {
        const { username, email, password } = request.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const selectUserQuery = `SELECT * FROM users WHERE username = ?;`;
        const dbUser = await db.get(selectUserQuery, [username]);

        if (!dbUser) {
            const addUserQuery = `
            INSERT INTO 
                users (username, password, email)
            VALUES
                (?, ?, ?);`;
            await db.run(addUserQuery, [username, hashedPassword, email]);
            response.status(201).send("User added successfully");
        } else {
            response.status(400).send("User already exists");
        }
    } catch (error) {
        console.error("Error during signup:", error);
        response.status(500).send("Internal Server Error");
    }
});

// Login Route
app.post("/login", async (request, response) => {
    const { username, password } = request.body;

    try {
        const selectUserQuery = `SELECT * FROM users WHERE username = ?;`;
        const dbUser = await db.get(selectUserQuery, [username]);

        if (!dbUser) {
            return response.status(400).json({ message: "Invalid User!" });
        }

        const isPasswordMatched = await bcrypt.compare(password, dbUser.password);

        if (isPasswordMatched) {
            return response.status(200).json({ message: "Login Successful!" });
        } else {
            return response.status(400).json({ message: "Invalid Password!" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
});

// News API Key and URL
const NEWS_API_KEY = '1c7a0e85df864762a9efaf86529ed9b9';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${NEWS_API_KEY}`;

// Fetch News Route
app.get('/api/news', async (req, res) => {
    try {
        const response = await fetch(NEWS_API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const articles = data.articles.map(article => ({
            image: article.urlToImage,
            headline: article.title,
            summary: article.description,
            link: article.url,
        }));
        res.json(articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news' });
    }
});
