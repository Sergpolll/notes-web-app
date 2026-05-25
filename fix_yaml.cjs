const fs = require('fs');
const path = require('path');
const rootDir = 'D:\\Гугл Диск\\Полякевич\\Нужное\\Obsidian\\1_Morning_Readings\\2026';

const folders = fs.readdirSync(rootDir);
let fixedCount = 0;

for (const folder of folders) {
    if (!folder.startsWith('Morning_Reading_')) continue;
    const essayPath = path.join(rootDir, folder, `Essay_${folder.replace('Morning_Reading_', '')}.md`);
    const morningPath = path.join(rootDir, folder, `${folder}.md`);
    
    let targetPath = null;
    if (fs.existsSync(essayPath)) targetPath = essayPath;
    else if (fs.existsSync(morningPath)) targetPath = morningPath;
    
    if (targetPath) {
        let content = fs.readFileSync(targetPath, 'utf-8');
        
        const originalContent = content;
        // Find topic: "..." and the next valid key scripture:
        // Replace everything in between with just a newline.
        content = content.replace(/(topic:\s*".*?")\r?\n[\s\S]*?(scripture:)/, '$1\n$2');
        
        if (content !== originalContent) {
            fs.writeFileSync(targetPath, content, 'utf-8');
            console.log(`Fixed YAML in ${path.basename(targetPath)}`);
            fixedCount++;
        }
    }
}

console.log(`Finished. Fixed ${fixedCount} files.`);
