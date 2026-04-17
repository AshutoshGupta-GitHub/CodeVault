//logic to push files and folder also.
const fs = require('fs').promises;
const path = require('path');

async function addRepo(filePath) {
    const repoPath = path.resolve(process.cwd(), '.apnaGit');
    const stagingPath = path.join(repoPath, 'staging');

    try {
        // 1. Ensure the staging directory exists
        await fs.mkdir(stagingPath, { recursive: true });

        // 2. Get initial stats for the path provided (e.g., "." or "filename.txt")
        const initialStats = await fs.stat(filePath);

        /**
         * Recursive function to handle:
         * - Single files
         * - Folders containing files
         * - Folders containing other folders (Nested)
         */
        async function processPath(currentPath, relativeTo = "") {
            const stats = await fs.stat(currentPath);

            if (stats.isDirectory()) {
                const files = await fs.readdir(currentPath);
                
                for (const file of files) {
                    // Skip system files to avoid infinite loops
                    if (file === '.apnaGit' || file === 'node_modules' || file === '.git') continue;

                    const fullPath = path.join(currentPath, file);
                    // If relativeTo is empty (like when adding "."), use the file name directly
                    const newRelativePath = path.join(relativeTo, file);
                    
                    await processPath(fullPath, newRelativePath);
                }
            } else {
                // It's a file - Recreate its exact folder structure in staging
                // This is what allows "models/user.txt" to stay inside a "models" folder
                const finalStagingPath = path.join(stagingPath, relativeTo);
                
                // Ensure the sub-folders exist in the staging area before copying
                await fs.mkdir(path.dirname(finalStagingPath), { recursive: true });
                
                // Copy the file from workspace to staging
                await fs.copyFile(currentPath, finalStagingPath);
                console.log(`Staged: ${relativeTo}`);
            }
        }

        // 3. Logic to start the process
        const absolutePath = path.resolve(filePath);
        
        // If user runs 'node index.js add .', we don't want the folder name "." in our paths
        const isCurrentDir = filePath === '.' || filePath === './';
        const startRelativePath = isCurrentDir ? "" : path.basename(absolutePath);

        await processPath(absolutePath, startRelativePath);
        
        console.log("\n✅ Successfully staged files and folders.");

    } catch (err) {
        console.error("Error during staging:", err);
    }
}

module.exports = { addRepo };

