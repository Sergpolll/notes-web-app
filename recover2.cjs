const fs = require('fs');
const readline = require('readline');
const logFile = 'C:\\Users\\Dell Precision\\.gemini\\antigravity\\brain\\ef3f299e-e64b-4edf-9211-5662f34e994c\\.system_generated\\logs\\transcript.jsonl';
const targetFile = 'C:\\Antigravity_Work\\recovered_17.txt';

async function run() {
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({ input: fileStream });

  let out = '';
  for await (const line of rl) {
    if (line.includes('11:1-3') || line.includes('погани прийняли') || line.includes('як власні упередження')) {
       out += line + '\n\n';
    }
  }
  fs.writeFileSync(targetFile, out, 'utf-8');
}
run();
