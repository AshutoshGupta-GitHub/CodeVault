
const fs = require("fs").promises;
const path = require("path");

async function revertRepo(commitID) {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");
    const commitDir = path.join(commitsPath, commitID);
    const workspaceDir = path.resolve(repoPath, "..");

    try {
        // 1. Verify if the commit ID exists
        try {
            await fs.access(commitDir);
        } catch (e) {
            console.error(`Error: Commit ID "${commitID}" does not exist locally.`);
            return;
        }

        /**
         * 2. Recursive function to restore files AND folders
         * This handles the folder structures we pushed earlier.
         */
        async function restoreRecursive(src, dest) {
            const stats = await fs.stat(src);

            if (stats.isDirectory()) {
                // Ensure the folder exists in the workspace
                await fs.mkdir(dest, { recursive: true });
                const entries = await fs.readdir(src);
                
                for (const entry of entries) {
                    // Skip the metadata file
                    if (entry === "commit.json") continue;

                    await restoreRecursive(
                        path.join(src, entry),
                        path.join(dest, entry)
                    );
                }
            } else {
                // It's a file, copy it directly
                await fs.copyFile(src, dest);
                // Get the relative path for a cleaner console log
                const relativePath = path.relative(commitDir, src);
                console.log(`Restored: ${relativePath}`);
            }
        }

        console.log(`⏳ Reverting workspace to version: ${commitID}\n`);
        
        // 3. Start the restoration from the commit folder
        await restoreRecursive(commitDir, workspaceDir);

        console.log(`\n✅ Successfully reverted to version: ${commitID}`);
        
    } catch (err) {
        console.error("Unable to revert: ", err.message);
    }
}

module.exports = { revertRepo };

// 