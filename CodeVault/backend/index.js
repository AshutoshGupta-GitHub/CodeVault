#!/usr/bin/env node 

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router.js");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init.js");   // This line importing initrepo function from init.js file
const { addRepo } = require("./controllers/add.js");  // This line importing add function from add.js file
const { commitRepo } = require("./controllers/commit.js");
const { pushRepo } = require("./controllers/push.js");
const { pullRepo } = require("./controllers/pull.js");
const { revertRepo } = require("./controllers/revert.js");

// const repoRouter = require("./routes/repo.router"); // <--- Check this line     gemini code

dotenv.config();

yargs(hideBin(process.argv))
    .command("start", "start a new server", {}, startServer)
    .command("init", "Initialise a new repository", {}, initRepo)       // Call initRepo when "init" command is used.
    .command(
        "add <file>",
        "Add a file to a repository",
        (yargs) => {
            yargs.positional("file", {
                describe: "File to add to the staging area",
                type: "string"
            });
        },
        (argv) => {
            addRepo(argv.file); // Call addRepo with the provided file path
        }
    )
    .command(
        "commit <message>",
        "Commit the staged files",
        (yargs) => {
            yargs.positional("message", {
                describe: "commmit message",
                type: "string"
            });
        },
        (argv) => {
            commitRepo(argv.message); // Call commitRepo with the provided message
        }

    )
    .command("push", "Push commits to S3", {}, pushRepo)
    .command("pull", "pull commits from S3", {}, pullRepo)
    .command(
        "revert <commitID>",
        "Revert to a specific commit",
        (yargs) => {
            yargs.positional("commitID", {
                describe: "commit ID to Rever to ",
                type: "string"
            });
        },
        (argv) => {
            revertRepo(argv.commitID); // Call revertRepo with the provided commit ID
        }
    )

    .demandCommand(1, "You need at least one command")
    .help().argv; // require at least one command;


function startServer() {

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URI;
    mongoose.connect(mongoURI).then(() => {
        console.log("MongoDB Connected");
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

    app.use(cors({ origin: "*" }));

    app.use("/", mainRouter);   // Use mainRouter for the root path    

    let user = "test";
    const httpServer = http.createServer(app);  // Create HTTP server
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userID) => {
            user = userID;
            console.log("===================");
            console.log(user);
            console.log("===================");
            socket.join(userID);
        });
    }); 

    const db = mongoose.connection;
    db.once("open", () => {
        console.log("CRUD operation called");
        //CRUD operations 
    });

    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    
}

