const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");       //Here we used mondb package
const dotenv = require("dotenv");
// var ObjectID = require("mongodb").ObjectID;

// These 2 new import statement by Gemini for fetching user by username instead of ID, for dynamic profiles based on username instead of ID. By Gemini
const User = require("../models/userModel");
const Repository = require("../models/repoModel"); //  THIS IS LIKELY MISSING

dotenv.config();
const uri = process.env.MONGODB_URI;
let client;


// ✅ NEW CODE (Works with latest MongoDB driver)
async function connectClient() {
    if (!client) {
        client = new MongoClient(uri); // No options needed
        await client.connect();
    }
}


async function signup(req, res) {
    // Logic to handle user signup
    const { username, password, email } = req.body;

    try {
        await connectClient();
        const db = client.db("githubclone"); //DB name
        const usersCollection = db.collection("users"); //Collection name

        // Check if user already exists
        const user = await usersCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedusers: [],
            starRepo: []
        };
        const result = await usersCollection.insertOne(newUser);
        const token = jwt.sign({ id: result.insertedId, username }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });

       
    } catch (err) {
        console.error("Error during signup:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function login(req, res) {
    // Logic to handle user login
    const { email, password } = req.body;    // Get username and password from request body

    try {
        await connectClient();  // Ensure the client is connected
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        // Find user by username
        const user = await usersCollection.findOne({ email });       // Find user by username
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: user._id });

    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function getAllUsers(req, res) {
    // Logic to retrieve all users from the database
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray(); // Fetch all users
        res.json(users);    // Send users as JSON response
    } catch (err) {
        console.error("Error fetching all users:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

//Gemini code for fetching user profile by ID (dynamic profiles)
// userController.js

async function getUserProfile(req, res) {
    // We get the ID from the URL parameters (matches your router: /profile/:id)
    const currentId = req.params.id;

    try {
        await connectClient(); // Ensuring connection is active
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        // CHANGE: Fetch user by ID
        // Note: Ensure you have imported ObjectId at the top of the file
        const user = await usersCollection.findOne({ _id: new ObjectId(currentId) });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // SUGGESTION: Remove the password from the response object before sending
        // This is a best practice for security in your college project
        const { password, ...userWithoutPassword } = user;

        // CHANGE: Send back the user object wrapped in a "user" key 
        // This matches the "setUser(data.user)" logic in Profile.jsx
        res.json({ user: userWithoutPassword });

    } catch (err) {
        console.error("Error fetching user profile:", err.message);
        res.status(500).send("Internal Server Error");
    }
}




async function updateUserProfile(req, res) {
    // Logic to update a specific user's profile
    const currentId = req.params.id;
    const { email, password } = req.body;

    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const updateFields = { email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(currentId) },
            { $set: updateFields },
            { returnDocument: "after" }
        );
        if (!result) {  //if(!result.value)
            return res.status(404).json({ message: "User not found" });
        }
        res.json(result);   //res.json(result.value); // Send updated user profile as JSON response

    } catch (err) {
        console.error("Error updating user profile:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function deleteUserProfile(req, res) {
    // Logic to delete a specific user
    const currentId = req.params.id;

    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({ _id: new ObjectId(currentId) });
        if (result.deletedCount == 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User Profile deleted successfully" });

    } catch (err) {
        console.error("Error deleting user profile:", err.message);
        res.status(500).send("Internal Server Error");
    }
}



// New function to fetch user by username (for dynamic profiles based on username instead of ID) by Gemini

async function getUserByUsername(req, res) {
    try {
        const { username } = req.params;
        console.log("Searching for username:", username); // Debug log in terminal

        // Find user (case-insensitive search)
        const user = await User.findOne({
            username: { $regex: new RegExp(`^${username}$`, "i") }
        });

        if (!user) {
            return res.status(200).json({ user: null, repos: [], message: "User not found" });
        }

        // Fetch their repositories
        // Ensure 'Repository' is imported at the top of the file!
        const repos = await Repository.find({ owner: user._id });

        res.json({ user, repos });
    } catch (err) {
        console.error("Backend Error in getUserByUsername:", err.message); // This prints the real error to your terminal
        res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
}



module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,

    getUserByUsername // Exporting the new function for fetching user by username By Gemini
};
