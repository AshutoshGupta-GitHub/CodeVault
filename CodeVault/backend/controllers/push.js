// This code is for to push files and folder.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const fs = require("fs").promises;
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // 1. Get Repo Name from config
    let repoName;
    try {
      const configPath = path.join(repoPath, "config.json");
      const configContent = await fs.readFile(configPath, "utf-8");
      const config = JSON.parse(configContent);
      repoName = config.name;
    } catch (error) {
      console.error("❌ Error: config.json not found.");
      return;
    }

    const commitDirs = await fs.readdir(commitsPath);

    // 2. Loop through each Commit ID folder
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);

      // --- RECURSIVE S3 UPLOAD HELPER ---
      async function uploadFolderToS3(currentPath, s3Prefix) {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry.name);
          // Create the S3 Key (Path in the cloud)
          const s3Key = `${s3Prefix}/${entry.name}`;

          if (entry.isDirectory()) {
            // If it's a folder, dive deeper
            await uploadFolderToS3(fullPath, s3Key);
          } else {
            // If it's a file, upload it
            const fileContent = await fs.readFile(fullPath);
            const params = {
              Bucket: S3_BUCKET,
              Key: s3Key,
              Body: fileContent,
            };
            await s3.upload(params).promise();
            console.log(`Uploaded: ${s3Key}`);
          }
        }
      }
      // ----------------------------------

      // Start the recursive upload for this specific commit
      await uploadFolderToS3(commitPath, `${repoName}/commits/${commitDir}`);
    }

    console.log(`\n✨ Successfully pushed all files and folders to AWS S3: ${repoName}`);
  } catch (err) {
    console.error("Error pushing to S3: ", err);
  }
}

module.exports = { pushRepo };

