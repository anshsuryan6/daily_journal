// routes/user.js

const { JWT_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");
const express = require("express");
const { User } = require("../db");
const mongoose = require("mongoose"); // Renamed 'mongo' to 'mongoose' for clarity

const UserRouter = express.Router();

UserRouter.post('/signup', async (req, res) => {
    // Add validation for username and password
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const existingUser = await User.findOne({ Username: req.body.username });
        if (existingUser) {
            return res.status(411).json({ message: "Username already taken" });
        }

        const user = await User.create({
            Username: req.body.username,
            password: req.body.password,
        });

        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        return res.json({ token });
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
});

UserRouter.post('/signin', async (req, res) => {
    // Add validation for username and password
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({
        Username: req.body.username,
        password: req.body.password // Note: Plain text password comparison is not secure. Use bcrypt.js for hashing.
    });

    if (user) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        return res.json({ token: token, message: "Logged in successfully" });
    } else {
        return res.status(411).json({ message: "Error while logging in / Incorrect username or password" });
    }
});

module.exports = UserRouter;