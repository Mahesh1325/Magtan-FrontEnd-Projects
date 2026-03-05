const fs = require('fs');
const path = require('path');

function replaceLegalLinks(filePath, isRoot) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    const targetPath = isRoot ? 'pages/404.html' : '404.html';

    content = content.replace(/<li><a href="#">Privacy Policy<\/a><\/li>/g, `<li><a href="${targetPath}">Privacy Policy</a></li>`);
    content = content.replace(/<li><a href="#">Terms of Service<\/a><\/li>/g, `<li><a href="${targetPath}">Terms of Service</a></li>`);
    content = content.replace(/<li><a href="#">FAQ<\/a><\/li>/g, `<li><a href="${targetPath}">FAQ</a></li>`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated links in ' + filePath);
}

replaceLegalLinks('./index.html', true);

const pagesDir = './pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

for (const f of files) {
    replaceLegalLinks(path.join(pagesDir, f), false);
}
