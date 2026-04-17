const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");

    try {
        // 1. Get Repo Name from the local config file
        const configPath = path.join(repoPath, "config.json");
        const configContent = await fs.readFile(configPath, "utf-8");
        const config = JSON.parse(configContent);
        const repoName = config.name;

        console.log(`🚀 Synchronizing repository: ${repoName}...`);

        const data = await s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: `${repoName}/commits/`, 
        }).promise();

        if (!data.Contents || data.Contents.length === 0) {
            console.log("⚠️ No remote data found for this repository.");
            return;
        }

        // 2. IDENTIFY LATEST FILES (Deduplication Logic)
        // This ensures if 'model.txt' was pushed 5 times, we only pull the newest one.
        const latestFilesMap = {};
        for (const item of data.Contents) {
            const keyParts = item.Key.split("/");
            if (keyParts[keyParts.length - 1] === "commit.json") continue; // Skip metadata

            // Get the path relative to the user's project (e.g., "models/user.js")
            const userRelativePath = keyParts.slice(3).join("/"); 

            if (!latestFilesMap[userRelativePath] || new Date(item.LastModified) > new Date(latestFilesMap[userRelativePath].LastModified)) {
                latestFilesMap[userRelativePath] = item;
            }
        }

        // 3. DOWNLOAD & RECONSTRUCT WORKSPACE
        console.log("📂 Reconstructing workspace structure...");
        
        for (const [relativePath, s3Object] of Object.entries(latestFilesMap)) {
            const localFilePath = path.join(process.cwd(), relativePath);

            // Create folders locally (like 'models/') if they don't exist
            await fs.mkdir(path.dirname(localFilePath), { recursive: true });

            const fileData = await s3.getObject({
                Bucket: S3_BUCKET,
                Key: s3Object.Key
            }).promise();

            await fs.writeFile(localFilePath, fileData.Body);
            console.log(`✅ Pulled: ${relativePath}`);
        }

        console.log("\n✨ Success! Your workspace is now synchronized with S3.");

    } catch (err) {
        // Error handling for missing config or network issues
        if (err.code === 'ENOENT') {
            console.error("❌ Error: Repository not initialized. Run 'init' first.");
        } else {
            console.error("❌ Pull Error:", err.message);
        }
    }
}

module.exports = { pullRepo };

