import fs from 'fs';
import path from 'path';

const ASSIGNMENTS_DIR = path.join(process.cwd(), '../temp-repo/DSA-Bootcamp-Java-main/assignments');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/dsa-data.json');

const data = {
  topics: []
};

// Map of file names to nice titles
const topicMap = {
  '01-flow-of-program.md': 'Flow of Program',
  '02-first-java.md': 'First Java',
  '03-conditionals-loops.md': 'Conditionals & Loops',
  '04-functions.md': 'Functions',
  '05-arrays.md': 'Arrays',
  '06-searching.md': 'Searching',
  '07-sorting.md': 'Sorting',
  '08-strings.md': 'Strings',
  '09-patterns.md': 'Patterns',
  '10-recursion.md': 'Recursion',
  '11-bitwise.md': 'Bitwise',
  '12-math.md': 'Math',
  '13-complexities.md': 'Complexities',
  '14-oop.md': 'OOP',
  '15-linkedlist.md': 'Linked List',
  '16-stack-queue.md': 'Stack & Queue',
  '17-trees.md': 'Trees',
  '18-heaps.md': 'Heaps'
};

const files = fs.readdirSync(ASSIGNMENTS_DIR).filter(f => f.endsWith('.md'));

let problemIdCounter = 1;

files.sort().forEach((file, index) => {
  const filePath = path.join(ASSIGNMENTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const title = topicMap[file] || file.replace('.md', '').replace(/^\d+-/, '');
  
  const topic = {
    id: `topic_${index + 1}`,
    title,
    problems: []
  };

  let currentDifficulty = 'Uncategorized';
  
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.match(/^###?\s+Easy/i)) currentDifficulty = 'Easy';
    else if (line.match(/^###?\s+Medium/i)) currentDifficulty = 'Medium';
    else if (line.match(/^###?\s+Hard/i)) currentDifficulty = 'Hard';
    else if (line.match(/^###?\s+/)) currentDifficulty = 'Uncategorized'; // other headings
    
    // Match standard markdown link pattern: - [Title](Link) or \d+. [Title](Link)
    const linkMatch = line.match(/^[\-\*]?\s*\d*\.?\s*\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      let problemTitle = linkMatch[1];
      let problemLink = linkMatch[2];
      
      let platform = 'Other';
      if (problemLink.includes('leetcode.com')) platform = 'LeetCode';
      else if (problemLink.includes('geeksforgeeks.org')) platform = 'GeeksForGeeks';
      else if (problemLink.includes('hackerrank.com')) platform = 'HackerRank';
      else if (problemLink.includes('spoj.com')) platform = 'SPOJ';
      else if (problemLink.includes('codingninjas.com')) platform = 'CodingNinjas';

      topic.problems.push({
        id: `prob_${problemIdCounter++}`,
        title: problemTitle.trim(),
        link: problemLink.trim(),
        difficulty: currentDifficulty,
        platform
      });
    }
  }

  // Only add topics that actually have problems parsed
  if (topic.problems.length > 0) {
    data.topics.push(topic);
  }
});

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));

console.log(`Successfully parsed ${data.topics.length} topics and ${problemIdCounter - 1} problems.`);
