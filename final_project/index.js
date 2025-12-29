const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Customer session
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for protected customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization && req.session.authorization.accessToken) {
        next(); // user is authenticated
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Mount general routes under /books
app.use("/books", genl_routes);

// Mount customer routes
app.use("/customer", customer_routes);

// Optional root route for testing
app.get("/", (req, res) => {
    res.send("Welcome to the Bookstore API! Use /books to access book routes.");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
