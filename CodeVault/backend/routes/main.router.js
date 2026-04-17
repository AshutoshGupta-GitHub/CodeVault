
const express = require("express");
const userRouter = require("./user.router.js");
const repoRouter = require("./repo.router.js");
const issueRouter = require("./issue.router.js");

const mainRouter = express.Router();

mainRouter.use(userRouter); // Mount userRouter to handle user-related routes
mainRouter.use(repoRouter); // Mount repoRouter to handle repository-related routes
mainRouter.use(issueRouter); // Mount issueRouter to handle issue-related routes


mainRouter.get("/", (req, res) => {
    res.send("Welcome!");
});

module.exports = mainRouter;


