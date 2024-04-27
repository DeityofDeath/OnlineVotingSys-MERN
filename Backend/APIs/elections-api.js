const exp = require("express");
const electionsApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require('../middleware/verifyToken');
require("dotenv").config();

let voters;
let admin;
let elections;
let votes;

electionsApp.use((req, res, next) => {
    voters = req.app.get("voters");
    admin = req.app.get("admin");
    elections = req.app.get("elections");
    votes = req.app.get("votes");
    next();
});

electionsApp.get('/electionsCount', expressAsyncHandler(async(req, res) => {
    try {
        const electionsCount = await elections.countDocuments();
        res.json({ electionsCount: electionsCount });
    } catch (error) {
        console.error("Error getting elections count:", error);
        res.status(500).json({ message: "Error getting elections count" });
    }
}));

module.exports = electionsApp;
