const mongoose = require("mongoose"); // here we are using mongoose
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createIssue(req, res) {
    // Logic to create an issue
    const { title, description } = req.body;
    const { id } = req.params; // repository ID from URL parameters

    try {
        const issue = new Issue({
            title,
            description,
            repository: id,
        });
        await issue.save(); // Save the new issue to the database
        res.status(201).json({ message: "Issue created successfully", issue });

    } catch (err) {
        console.error("Error creating issue:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function updateIssueById(req, res) {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const issue = await Issue.findById(id,);

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        issue.title = title;    // Update issue fields  
        issue.description = description;        // Update issue description
        issue.status = status;      // Update issue status

        await issue.save(); // Save the updated issue to the database

        res.json({ message: "Issue updated successfully", issue: issue });

    } catch (err) {
        console.error("Error updating issue:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function deleteIssueById (req, res) {
    const { id } = req.params;

    try {
        const issue = await Issue.findByIdAndDelete(id);    
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }
        res.json({ message: "Issue deleted successfully" });

    } catch (err) {
        console.error("Error during deleting issue:", err.message);
        res.status(500).send("Internal Server Error");
    } 

};

async function getAllIssues(req, res) {
    const { id } = req.params; // repository ID from URL parameters

    try {
        const issues = await Issue.find({ repository: id }); // Find issues by repository ID

        if (!issues) {
            return res.status(404).json({ message: "No issues found for this repository" });
        }

        res.status(200).json({ issues });

    } catch (err) {
        console.error("Error during fetching issues:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function getIssueById(req, res){
    const { id } = req.params;

    try {
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.status(200).json({ issue });

    } catch (err) {
        console.error("Error during fetching issue:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
};