const express = require("express");
const mysql = require("mysql2");
const nanoid = require("nanoid");
const cors = require("cors");
// Load the config from .env
require("dotenv").config();

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "urlshortener"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL connected...");
});

const PORT = process.env.port || 3000;

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Register User
app.post("/register", (req, res) => {
    db.query("INSERT INTO Users(username, password) VALUES(?, ?)", [req.body.username, req.body.password], (err, result) => {
        if (err) {
            res.status(500).json({ code: 500, message: "An Error Ocurred" });
            throw err;
        }
        console.log(result);
        res.status(201).json({ code: 201, message: "Created User Successfully", user: req.body.username });
    });
});

// Autheticate User
app.post("/authenticate", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM Users WHERE username = ?", [username], (err, result) => {
        if (err) {
            res.status(500).json({ code: 500, message: "An Error Ocurred" });
            throw err;
        }
        console.log(result);
        if (result.length <= 0) {
            console.log("User not found");
            res.status(404).json({ code: 404, message: "User Not Found!" });
        } else {
            const user = result[0];
            if (user.password === password) {
                console.log("Authentication Successfull");
                res.status(200).json({ code: 200, message: "Authentication Successfull!", user: username });
            } else {
                console.log("Incorrect Password");
                res.status(401).json({ code: 401, message: "Incorrect Password!" });
            }
        }
    });
});

// Create Link
app.post("/create", (req, res) => {
    const { link, user } = req.body;
    console.log(req.body);
    let id = nanoid.nanoid(8);

    db.query("INSERT INTO Links VALUES(?, ?, ?, 0)", [id, link, user], (err, result) => {
        if (err) {
            res.status(500).json({ code: 500, message: "An Error Ocurred" });
            throw err;
        }
        console.log(result);
        res.status(201).json({ code: 201, message: "Created Link Successfully", linkId: id });
    });
});

// Open Link
app.get("/link/:id", (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM Links WHERE id = ?", [id], (err, result) => {
        if (err) {
            res.status(500).json({ code: 500, message: "An Error Ocurred" });
            throw err;
        }
        console.log(result);
        let link = result[0].link;
        db.query("UPDATE Links SET visits = visits + 1 WHERE id = ?", [id], (error, result) => {
            if (error) {
                res.status(500).json({ code: 500, message: "An Error Ocurred" });
                throw error;
            }
            console.log(result);
        });
        res.redirect(302, link);
    });
});

// Get Links created by a user
app.get("/get-user-links", (req, res) => {
    const username = req.query.username;
    db.query("SELECT * FROM Links WHERE owner = ?", [username], (err, result) => {
        if (err) {
            res.status(500).json({ code: 500, message: "An Error Ocurred" });
            throw err;
        }
        console.log(result);
        res.status(200).json({ code: 200, message: "Fetched Links Successfully", links: result });
    });
});

app.listen(PORT, () => console.log("Server Started on Port", PORT));