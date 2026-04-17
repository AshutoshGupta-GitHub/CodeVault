const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function commitRepo(message) {
    const repoPath = path.resolve(process.cwd(), '.apnaGit');
    const stagedPath = path.join(repoPath, 'staging');
    const commitPath = path.join(repoPath, 'commits');

    try {
        const commitID = uuidv4();
        const commitDir = path.join(commitPath, commitID);

        await fs.mkdir(commitDir, { recursive: true });

        // --- RECURSIVE COPY HELPER ---
        async function copyFolderRecursive(src, dest) {
            const stats = await fs.stat(src);
            
            if (stats.isDirectory()) {
                // Create the folder in the commit directory
                await fs.mkdir(dest, { recursive: true });
                const entries = await fs.readdir(src);
                
                for (const entry of entries) {
                    await copyFolderRecursive(
                        path.join(src, entry),
                        path.join(dest, entry)
                    );
                }
            } else {
                // It's a file, we can use copyFile
                await fs.copyFile(src, dest);
            }
        }
        // -----------------------------

        const files = await fs.readdir(stagedPath);

        for (const file of files) {
            await copyFolderRecursive(
                path.join(stagedPath, file),
                path.join(commitDir, file)
            );
        }

        await fs.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify({ message, timestamp: new Date().toISOString() })
        );
        
        console.log(`Commit ${commitID} created with message: "${message}"`);

    } catch (err) {
        console.error("Error during commit:", err);
    }
}

module.exports = { commitRepo };

