const fs = require('fs');
const path = require('path');

const rootDir = 'D:\\Гугл Диск\\Полякевич\\Нужное\\Obsidian\\1_Morning_Readings\\2026';
const output = [];

function extractContext(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let scripture = 'Unknown';
    let essence = '';
    
    // Extract Scripture from YAML or Quote block
    const scriptureMatch = content.match(/scripture:\s*\[?([^\]\n]+)\]?/);
    if (scriptureMatch) scripture = scriptureMatch[1].replace(/["']/g, '');

    // Extract first 400 characters after YAML as essence
    const bodyMatch = content.split('---');
    if (bodyMatch.length >= 3) {
        const body = bodyMatch.slice(2).join('---').trim();
        // Remove blockquote characters
        essence = body.replace(/^>\s?/gm, '').substring(0, 500) + '...';
    }

    return { scripture, essence };
}

const folders = fs.readdirSync(rootDir);
for (const folder of folders) {
    if (folder.startsWith('Morning_Reading_')) {
        const date = folder.replace('Morning_Reading_', '').replace(/_/g, '-');
        // skip the one we already did
        if (date === '2026-05-25') continue;

        // look for Morning_Reading_...md or Essay_...md
        const essayPath = path.join(rootDir, folder, `Essay_${folder.replace('Morning_Reading_', '')}.md`);
        const morningPath = path.join(rootDir, folder, `${folder}.md`);
        
        if (fs.existsSync(essayPath)) {
            const data = extractContext(essayPath);
            output.push({ date, type: 'essay', ...data });
        } else if (fs.existsSync(morningPath)) {
            const data = extractContext(morningPath);
            output.push({ date, type: 'morning', ...data });
        }
    }
}

// take the last 10 notes to not overload the AI context
const recent = output.slice(-10);
fs.writeFileSync('C:\\Antigravity_Work\\Notes_Web_App\\notes_context.json', JSON.stringify(recent, null, 2));
console.log('Extracted ' + recent.length + ' notes.');
