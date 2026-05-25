const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logFile = 'C:\\Users\\Dell Precision\\.gemini\\antigravity\\brain\\ef3f299e-e64b-4edf-9211-5662f34e994c\\.system_generated\\logs\\transcript.jsonl';
const targetFile = 'C:\\Antigravity_Work\\recovered_17.txt';

async function run() {
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let foundContent = '';
  for await (const line of rl) {
    if (line.includes('Morning_Reading_2026_05_17/Essay_2026_05_17.md') && line.includes('"type":"PLANNER_RESPONSE"')) {
      // It might be in the model's output or tool output.
      // Actually, we want the system output of view_file.
    }
    if (line.includes('Morning_Reading_2026_05_17/Essay_2026_05_17.md') && line.includes('"type":"ACTION_OUTPUT"')) {
      try {
         const obj = JSON.parse(line);
         if (obj.content && obj.content.includes('Total Lines:')) {
            foundContent = obj.content;
         }
      } catch (e) {}
    }
  }
  
  if (foundContent) {
    fs.writeFileSync(targetFile, foundContent, 'utf-8');
    console.log('Recovered!');
  } else {
    console.log('Not found');
  }
}

run();
