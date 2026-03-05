const fs = require('fs');
const path = require('path');

function addLegalLinks(filePath, isRoot) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already added to avoid duplication
    if (content.includes('>404 Page</a>')) {
        console.log('Already updated ' + filePath);
        return;
    }

    const target404 = isRoot ? 'pages/404.html' : '404.html';
    const targetComing = isRoot ? 'pages/coming-soon.html' : 'coming-soon.html';

    // We are looking for the closing </ul> in the Legal footer column.
    // However, a safe way is to replace the FAQ line with itself plus the new links.
    const searchString = `FAQ</a></li>`;
    const replacementString = `FAQ</a></li>
                        <li><a href="${target404}">404 Page</a></li>
                        <li><a href="${targetComing}">Coming Soon</a></li>`;

    content = content.replace(searchString, replacementString);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Added links in ' + filePath);
}

addLegalLinks('./index.html', true);

const pagesDir = './pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

for (const f of files) {
    addLegalLinks(path.join(pagesDir, f), false);
}
