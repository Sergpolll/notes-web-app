import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = 'D:\\Гугл Диск\\Полякевич\\Нужное\\Obsidian\\1_Morning_Readings\\2026';
const DEST_DIR = path.join(__dirname, 'public', 'notes');
const INDEX_FILE = path.join(__dirname, 'public', 'notes_index.json');

const ukrainianMonths = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];

// Custom YAML parser matching the one in App.jsx
function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  
  const yamlString = match[1];
  const data = {};
  
  yamlString.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });
  
  return data;
}

function processDirectory() {
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  const groupedNotes = {};
  const allSubDirs = fs.readdirSync(SOURCE_DIR);

  allSubDirs.forEach(subDir => {
    const fullSubDirPath = path.join(SOURCE_DIR, subDir);
    if (!fs.statSync(fullSubDirPath).isDirectory()) return;

    const dateStr = subDir.replace('Morning_Reading_', '');
    const essayFile = `Essay_${dateStr}.md`;
    const morningFile = `${subDir}.md`;

    let fileToSync = null;
    if (fs.existsSync(path.join(fullSubDirPath, essayFile))) {
      fileToSync = essayFile;
    } else if (fs.existsSync(path.join(fullSubDirPath, morningFile))) {
      fileToSync = morningFile;
    }

    if (!fileToSync) return;

    const filePath = path.join(fullSubDirPath, fileToSync);
    const content = fs.readFileSync(filePath, 'utf-8');
    const metadata = parseFrontmatter(content);

    // Only process files with a date, topic, and type='essay'
    if (metadata && metadata.date && (metadata.topic || metadata.title)) {
      if (metadata.type !== 'essay') return;

        // Parse month from YYYY-MM-DD
        const dateParts = metadata.date.split('-');
        if (dateParts.length >= 2) {
          const monthIndex = parseInt(dateParts[1], 10) - 1;
          const monthName = ukrainianMonths[monthIndex];

          const destFileName = `${subDir}_${fileToSync}`; // Ensure uniqueness
          fs.copyFileSync(filePath, path.join(DEST_DIR, destFileName));

          if (!groupedNotes[monthName]) {
            groupedNotes[monthName] = [];
          }

          groupedNotes[monthName].push({
            filename: destFileName,
            date: metadata.date,
            topic: metadata.web_title || metadata.topic || metadata.title,
            type: metadata.type || 'note'
          });
        }
      }
  });

  // Sort notes within each month by date descending
  Object.keys(groupedNotes).forEach(month => {
    groupedNotes[month].sort((a, b) => b.date.localeCompare(a.date));
  });

  // Sort months based on index
  const sortedGroupedNotes = {};
  ukrainianMonths.slice().reverse().forEach(month => {
    if (groupedNotes[month]) {
      sortedGroupedNotes[month] = groupedNotes[month];
    }
  });

  fs.writeFileSync(INDEX_FILE, JSON.stringify(sortedGroupedNotes, null, 2));
  console.log('Sync complete! Saved to notes_index.json');
}

processDirectory();
