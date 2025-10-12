const fs = require('fs');
const packageJson = fs.readFileSync('package.json');

const releaseDate = new Date().toISOString().split('T')[0];
packageJson.releaseDate = releaseDate;

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
