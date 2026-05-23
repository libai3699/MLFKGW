import fs from 'fs';
import path from 'path';

const transcriptPath =
  'C:/Users/user/.cursor/projects/d-ML-gw/agent-transcripts/58837011-c2b6-41f7-8690-e02d1e018890/58837011-c2b6-41f7-8690-e02d1e018890.jsonl';
const root = path.resolve('d:/ML/gw');

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
const latestByPath = new Map();

for (const line of lines) {
  if (!line.includes('"Write"') || !line.includes('src')) {
    continue;
  }

  try {
    const event = JSON.parse(line);
    for (const part of event.message?.content || []) {
      if (part.type !== 'tool_use' || part.name !== 'Write') {
        continue;
      }

      const filePath = part.input?.path?.replace(/\\/g, '/');
      const contents = part.input?.contents;
      if (!filePath || !contents || !filePath.toLowerCase().includes('/gw/')) {
        continue;
      }

      latestByPath.set(filePath.toLowerCase(), { filePath, contents });
    }
  } catch {
    // ignore malformed lines
  }
}

let restored = 0;
for (const { filePath, contents } of latestByPath.values()) {
  const normalized = filePath.replace(/^d:/i, 'd:');
  const absolute = path.isAbsolute(normalized)
    ? normalized
    : path.join(root, normalized.replace(/^d:\/ML\/gw\//i, ''));

  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, contents);
  console.log('restored', path.relative(root, absolute));
  restored += 1;
}

console.log(`Restored ${restored} files from transcript.`);
