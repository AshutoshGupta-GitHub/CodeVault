const mongoose = require("mongoose"); // here we are using mongoose
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository(req, res) {
    // Logic to create a new repository
    const { owner, name, issues, content, description, visibility } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: "Repository name is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const newRepository = new Repository({
            name,
            description,
            visibility,
            owner,
            content,
            issues,
        });

        const result = await newRepository.save();

        res.status(201).json({
            message: "Repository created successfully",
            repositoryID: result._id
        })
    } catch (err) {
        console.error("Error creating repository:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function getAllRepositories(req, res) {
    // Logic to fetch all repositories

    try {
        const repositories = await Repository.find({})  //  Fetch all repositories
            .sort({ createdAt: -1 }) // 👈 ADD THIS: Sorts by newest first this line is added to sord the recently created repo by other user. (By Gemini)
            .populate('owner') // Populate owner details
            .populate('issues'); // Populate issues details

        res.json(repositories); // Send repositories as JSON response
    } catch (err) {
        console.error("Error during fetching repositories:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

// Gemini code to resolve the issue of fetching repository by ID

async function fetchRepositoryById(req, res) {
    const { id } = req.params;

    // 1. THIS IS THE SILENCER:
    // If the ID is missing or the literal string "null", stop here quietly.
    if (!id || id === "null" || id === "undefined" || id === "") {
        return res.status(400).json({ message: "No valid ID provided" });
    }

    // 2. CHECK FORMAT: 
    // Mongoose crashes if we pass a non-24-character string to findById.
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const repository = await Repository.findById(id);
        if (!repository) return res.status(404).json({ error: "Repository not found" });
        res.json(repository);
    } catch (err) {
        // This block will no longer trigger for "null" IDs!
        console.error("Database Error:", err.message);
        res.status(500).send("Internal Server Error");
    }
}


async function fetchRepositoryByName(req, res) {
    // Logic to fetch a repository by its Name
    const { name } = req.params;
    try {
        const repository = await Repository.find({ name })    // Fetch repository by Name
            .populate('owner') // Populate owner details
            .populate('issues'); // Populate issues details

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        res.json(repository);
    } catch (err) {
        console.error("Error fetching repository by Name:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

//Gemini code
async function fetchRepositoryForCurrentUser(req, res) {
    // 1. CHANGE THIS LINE: Use req.params.userID to match your router
    const userID = req.params.userID;

    try {
        const repositories = await Repository.find({ owner: userID });

        // 2. THE FIX: Return 200 even if empty so .map() doesn't fail
        if (!repositories || repositories.length === 0) {
            return res.status(200).json({ repositories: [] });
        }

        res.json({ message: "Repositories found", repositories });
    } catch (err) {
        console.error("Error fetching repositories for current user:", err.message);
        res.status(500).send("Internal Server Error");
    }
}



async function updateRepositoryById(req, res) {
    // Logic to update a repository by its ID
    const { id } = req.params;
    const { content, description } = req.body;

    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();
        res.json({
            message: "Repository updated successfully",
            repository: updatedRepository,
        }); // Send updated repository as JSON response

    } catch (err) {
        console.error("Error updating repository by ID:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function toggleVisibilityById(req, res) {
    // Logic to toggle the visibility of a repository by its ID
    const { id } = req.params;

    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        repository.visibility = !repository.visibility;

        const updatedRepository = await repository.save();
        res.json({
            message: "Repository visibility toggled successfully",
            repository: updatedRepository,
        }); // Send updated repository as JSON response

    } catch (err) {
        console.error("Error during toggling visibility:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function deleteRepositoryById(req, res) {
    // Logic to delete a repository by its ID
    const { id } = req.params;

    try {
        const repository = await Repository.findByIdAndDelete(id);
        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }
        res.json({ message: "Repository deleted successfully" });
    } catch (err) {
        console.error("Error deleting repository by ID:", err.message);
        res.status(500).send("Internal Server Error");
    }

};

//This Function is made by Gemini to fetch the files of a repository from S3, 
// it is not present in the video but it is required for the frontend to display the files of a repository.
// It is added in the repoController and the route is added in the repo.router.js

const { s3, S3_BUCKET } = require("../config/aws-config");

async function getRepoFiles(req, res) {
    // 1. Permanent Fix: Decode the incoming parameter
    const rawRepoName = req.params.repoName;
    const repoName = decodeURIComponent(rawRepoName);

    try {
        const params = {
            Bucket: S3_BUCKET,
            Prefix: `${repoName}/commits/`, 
        };

        const data = await s3.listObjectsV2(params).promise();

        console.log(`📡 Fetching: "${repoName}" | Found: ${data.Contents ? data.Contents.length : 0} items`);

        if (!data.Contents || data.Contents.length === 0) {
            return res.json({ files: [] });
        }

        const latestFilesMap = {};

        data.Contents.forEach(item => {
            const key = item.Key;
            const pathParts = key.split("/");
            
            // Logic: repo/commits/ID/folder/file.txt -> we want parts from index 3 onwards
            const userPath = pathParts.slice(3).join("/");
            const fileName = pathParts[pathParts.length - 1];

            // Ignore system metadata and folder-only entries
            if (userPath !== "" && fileName !== "commit.json") {
                const fileData = {
                    name: fileName,
                    displayPath: userPath,
                    fullPath: key,
                    lastModified: item.LastModified,
                    size: item.Size
                };

                // Keep newest version of this specific path
                if (!latestFilesMap[userPath] || new Date(item.LastModified) > new Date(latestFilesMap[userPath].lastModified)) {
                    latestFilesMap[userPath] = fileData;
                }
            }
        });

        res.json({ files: Object.values(latestFilesMap) });
    } catch (err) {
        console.error(`❌ S3 Error for ${repoName}:`, err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//


// 2. NEW FUNCTION: To fetch the actual text content of a file
async function getFileContent(req, res) {
    const { repoName, fileName } = req.params;

    try {
        // 1. First, we list everything in that repo to find the ACTUAL full path (Key)
        const listParams = {
            Bucket: S3_BUCKET,
            Prefix: `${repoName}/`, 
        };

        const listData = await s3.listObjectsV2(listParams).promise();
        
        // 2. Search for the item that ends with our filename
        const actualFile = listData.Contents.find(item => item.Key.endsWith(fileName));

        if (!actualFile) {
            console.error(`File ${fileName} not found in repo ${repoName}`);
            return res.status(404).json({ error: "File not found in S3." });
        }

        console.log("Found actual S3 Key:", actualFile.Key);

        // 3. Now fetch using the exact key we just found
        const getParams = {
            Bucket: S3_BUCKET,
            Key: actualFile.Key
        };

        const data = await s3.getObject(getParams).promise();
        const content = data.Body.toString("utf-8");

        res.json({ content });
    } catch (err) {
        console.error("Error in getFileContent:", err);
        res.status(500).json({ error: "Failed to fetch content from AWS." });
    }
}

// Code for Upload file opition 
const multer = require("multer");
const storage = multer.memoryStorage(); // Store files in memory temporarily
const upload = multer({ storage: storage });

async function uploadFilesFromBrowser(req, res) {
    const { repoName } = req.params;
    const files = req.files; // Array of files from multer

    try {
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const uploadPromises = files.map(async (file) => {
            const params = {
                Bucket: S3_BUCKET,
                // We save it in a folder called 'uploads' within the repo
                Key: `${repoName}/commits/web-upload-${Date.now()}/${file.originalname}`,
                Body: file.buffer,
            };
            return s3.upload(params).promise();
        });

        await Promise.all(uploadPromises);

        res.json({ message: "Files uploaded successfully to " + repoName });
    } catch (err) {
        console.error("Browser Upload Error:", err);
        res.status(500).json({ error: "Failed to upload files" });
    }
}

// Add this to module.exports: uploadFilesFromBrowser, upload (for the route)


module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById,

    getRepoFiles, // Export the new function    
    getFileContent, // Export the new function  ni
    uploadFilesFromBrowser, // Export the new function for uploading files from the browser (upload files) option 
};

