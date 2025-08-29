// routes/post.js

const { JWT_SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");
const express = require("express");
const { Post, User } = require("../db");

const PostRouter = express.Router();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "No token provided" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

// Route to get all posts without authentication (optional)
PostRouter.get('/bulk', async (req, res) => {
    try {
        const blogs = await Post.find({}).populate('author', 'Username');
        return res.json({ blogs });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching posts" });
    }
});

// All routes below this line will use the authMiddleware
// This is a common and clean way to apply middleware to multiple routes.
PostRouter.use(authMiddleware);

// Route to create a new post (requires authentication)
PostRouter.post('/post', async (req, res) => {
    const userId = req.userId;
    const { title, content } = req.body;

    // Basic validation
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    try {
        const post = await Post.create({
            title,
            content,
            author: userId,
        });

        return res.status(201).json({
            id: post._id,
            message: "Post created successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: "Error creating post" });
    }
});

// Route to get the username of the authenticated user
PostRouter.get('/uname', async (req, res) => {
    const id = req.userId;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ uname: user.Username });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching username" });
    }
});

// Route to get a single post by ID
PostRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await Post.findById(id).populate('author', 'Username');
        if (!blog) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.json(blog);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching post" });
    }
});

module.exports = PostRouter;