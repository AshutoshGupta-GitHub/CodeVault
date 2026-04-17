const express = require("express");
const repoController = require("../controllers/repoController.js");
const repoRouter = express.Router();

// for upload files options
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoryForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);   
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
repoRouter.get("/repo/files/:repoName", repoController.getRepoFiles); // New route to fetch files of a repository from S3 made by Gemini

// New route to fetch the actual text inside a specific file
repoRouter.get("/repo/file-content/:repoName/:fileName", repoController.getFileContent);    //new route to fetch the actual text inside a specific file, which is required for the frontend to show the content of a file when clicked on it in the frontend. This route is added in the repoController and the function getFileContent() is added in the repoController.js file by Gemini.

// repoRouter.get("/all", repoController.getAllRepositories);  //this route is added to fetch all the repositories of all the users, new route by Geminii


// this route if for upload files options
// repoRouter.post("/upload-files/:repoName", upload.array("files"), repoController.uploadFilesFromBrowser);

// Remove the leading "/repo" from this string
repoRouter.post("/upload-files/:repoName", upload.array("files"), repoController.uploadFilesFromBrowser);

module.exports = repoRouter;
