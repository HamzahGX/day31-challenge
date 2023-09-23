const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const bcrypt = require("bcrypt"); // Include the bcrypt library

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(
  session({ secret: "POKEMON", resave: false, saveUninitialized: false })
);
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(csurf({ cookie: true }));

// Simulated user data with securely hashed and salted password
const users = [{ username: "admin", passwordHash: "$allisALL#" }];

// Authentication function
const authenticateUser = (username, password) => {
  const user = users.find((u) => u.username === username);
  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    return true; // Authentication successful
  }
  return false; // Authentication failed
};

// Routes
app.get("/", (req, res) => {
  res.render("index", { csrfToken: req.csrfToken() });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (authenticateUser(username, password)) {
    req.session.isAuthenticated = true;
    res.redirect("/dashboard");
  } else {
    res.redirect("/");
  }
});

app.get("/dashboard", (req, res) => {
  if (req.session.isAuthenticated) {
    res.render("dashboard");
  } else {
    res.redirect("/");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
