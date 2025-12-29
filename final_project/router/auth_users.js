const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // registered users

// Check if username is valid (not already registered)
const isValid = (username) => {
    return !users.some(user => user.username === username);
};

// Check if username and password match
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Login route for registered users (Task 7)
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            { username },
            "access",  // secret key
            { expiresIn: 60 * 60 }  // 1 hour
        );

        req.session.authorization = {
            accessToken,
            username
        };
        return res.status(200).json({ message: "User successfully logged in", accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add or modify a book review (Task 8)
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text required" });
    }

    // Save review keyed by username
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: `Review added/updated for ISBN ${isbn}`, reviews: books[isbn].reviews });
});

// Delete a book review (Task 9)
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Delete review by username
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: `Review deleted for ISBN ${isbn}`, reviews: books[isbn].reviews });
    } else {
        return res.status(404).json({ message: "Review not found for this user" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
