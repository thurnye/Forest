import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base path
const basePath = path.join(__dirname, '../src', 'features');

// Subfolders to create in each feature
const subDirs = [
  'components',
  'pages',
  'services',
  'hooks',
  'types',
  'utils',
  'router',
  'redux',
  'mock'
];

function createFeature(moduleName) {
  // Use lowercase for folder names to match existing convention (auth, student, guardian, etc.)
  const featureName = moduleName.trim().toLowerCase();
  const featurePath = path.join(basePath, featureName);

  if (fs.existsSync(featurePath)) {
    console.log(`❌ Feature "${featureName}" already exists at ${featurePath}`);
    return;
  }

  // Create main feature folder
  fs.mkdirSync(featurePath, { recursive: true });
  console.log(`📁 Created feature folder: ${featureName}`);

  // Create subdirectories
  subDirs.forEach((dir) => {
    const subDirPath = path.join(featurePath, dir);
    fs.mkdirSync(subDirPath, { recursive: true });
    console.log(`   ├── 📂 Created subfolder: ${dir}`);
  });

  // Create README file with capitalized display name
  const displayName = capitalize(featureName);
  const readmeFile = path.join(featurePath, 'README.md');
  fs.writeFileSync(
    readmeFile,
    `# ${displayName} Feature\n\n**Description:** Add details about the ${displayName} feature here.\n\n## Structure\n${subDirs
      .map((d) => `- ${d}/`)
      .join('\n')}\n`
  );
  console.log('   ├── 📄 Created file: README.md');

  console.log(`Feature "${featureName}" scaffold created successfully!\n`);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- CLI Input Handling ---
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(' Please provide one or more feature names. Example:');
  console.error('   npm run create:feature Home Recipes Profile');
  process.exit(1);
}

args.forEach(createFeature);
