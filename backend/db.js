// db.js

const mongoose = require('mongoose');

// Replace "your_database_name" with the actual name of your database.
// This is an example for a local MongoDB connection.
const MONGO_URI = "mongodb://localhost:27017/daily_journal_db";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully!");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
});

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", PostSchema);

module.exports = { User, Post };