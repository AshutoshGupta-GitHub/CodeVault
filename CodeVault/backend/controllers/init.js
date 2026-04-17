// for initializing the local repository for apna-git. This sets up the necessary folder structure and configuration for future commits and pushes to the S3 bucket.

const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // 1. Create the .apnaGit directory
    await fs.mkdir(repoPath, { recursive: true });
    // 2. Create the commits directory inside .apnaGit
    await fs.mkdir(commitsPath, { recursive: true });

    // --- UPDATED SECTION START ---
    // 3. Create the Identity (config.json)
    // We take the name of the current folder as the Repository Name.
    // Ensure this folder name matches the one you created on the Dashboard!
    const repoName = path.basename(process.cwd()); 

    const config = {
      name: repoName,
      description: "Initialized via apna-git CLI",
      createdAt: new Date().toISOString()
    };

    // 4. Write the config.json file
    // This file is the "handshake" that tells the push command where to send files.
    await fs.writeFile(
      path.join(repoPath, "config.json"), 
      JSON.stringify(config, null, 2)
    );
    // --- UPDATED SECTION END ---

    console.log(`✨ Repository initialized locally.`);
    console.log(`📍 Project Name: ${repoName}`);
    console.log(`📂 Created .apnaGit and config.json`);
    
  } catch (err) {
    console.error("Error during initialization:", err);
  }
}

module.exports = { initRepo };


