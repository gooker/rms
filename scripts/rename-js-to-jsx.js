const fs = require('fs');
const path = require('path');

// Options
const src = process.argv[2] ?? './';
const pattern = process.argv[3] ? new RegExp(`${process.argv[3]}$`) : /.js$/;
const newExtension = process.argv[4] ?? '.jsx';

console.log(`Path = ${src} ; pattern = ${pattern} ; newExtension = ${newExtension}`);

const getAllFiles = (dirPath, pattern, files = []) => {
  const filesInDirectory = fs.readdirSync(dirPath);

  return filesInDirectory.reduce((foundFiles, file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      return getAllFiles(`${dirPath}/${file}`, pattern, foundFiles);
    } else {
      if (!matchPattern(file, pattern)) {
        return foundFiles;
      }

      return [...foundFiles, path.join(__dirname, dirPath, '/', file)];
    }
  }, files);
};

const matchPattern = (filename, pattern) => filename.match(pattern);

const readFile = (path) => fs.readFileSync(path).toString('utf-8');

const renameFile = (path, extension) => {
  try {
    fs.renameSync(path, path.replace(pattern, extension));
    console.log(`${path} [RENAMED]`);
    return true;
  } catch (error) {
    console.log(`${path} [KO]`, error);
    return false;
  }
};

// <> </> <tag /> <tag></tag>
const containsJSX = (content) => /(<\/|\/>)/.test(content);

// Run
console.log('Search files...');

const files = getAllFiles(src, pattern)
  .map((file) => ({ filename: file, content: readFile(file) }))
  .filter((file) => containsJSX(file.content))
  .map((file) => file.filename);

console.log('Found files', files.length);

console.log('Renaming...');

const successFiles = files.map((file) => renameFile(file, newExtension)).filter(Boolean);

console.log(`Rename ${successFiles.length}/${files.length} with success.`);

if (successFiles.length !== files.length) {
  console.log('Execution encountered some errors.');
  process.exit(1);
}
