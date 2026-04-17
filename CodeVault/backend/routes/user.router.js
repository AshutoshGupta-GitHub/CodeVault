const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);

// This MUST match the /user/username/ part of your frontend fetch
userRouter.get("/username/:username", userController.getUserByUsername);        // New route to fetch user by username instead of ID, for dynamic profiles based on username instead of ID. By Gemini

module.exports = userRouter;