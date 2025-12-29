const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // For simulating async calls

// Task 6 - Register user (already synchronous)
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.some(u => u.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Task 10 – Get list of all books using async/await
public_users.get('/', async (req, res) => {
    try {
        // Simulate async call with Promise
        const allBooks = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(books), 100); // 100ms delay to simulate async
        });
        return res.status(200).json(allBooks);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Task 11 – Get book details by ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (books[isbn]) resolve(books[isbn]);
                else reject(new Error("Book not found"));
            }, 100);
        });
        return res.status(200).json(book);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// Task 12 – Get books by author using async/await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const results = Object.values(books).filter(b => b.author === author);
                if (results.length > 0) resolve(results);
                else reject(new Error("No books found for this author"));
            }, 100);
        });
        return res.status(200).json(booksByAuthor);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// Task 13 – Get books by title using async/await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const booksByTitle = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const results = Object.values(books).filter(b => b.title === title);
                if (results.length > 0) resolve(results);
                else reject(new Error("No books found with this title"));
            }, 100);
        });
        return res.status(200).json(booksByTitle);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// Get book review (keep synchronous)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
