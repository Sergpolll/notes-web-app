const fs = require('fs');
const path = require('path');

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  
  const yamlString = match[1];
  const data = {};
  
  yamlString.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      data[key] = value;
    }
  });
  
  return data;
}

const file = 'D:\\Гугл Диск\\Полякевич\\Нужное\\Obsidian\\1_Morning_Readings\\2026\\Morning_Reading_2026_05_10\\Essay_2026_05_10.md';
const content = fs.readFileSync(file, 'utf-8');
const metadata = parseFrontmatter(content);
console.log(metadata);
