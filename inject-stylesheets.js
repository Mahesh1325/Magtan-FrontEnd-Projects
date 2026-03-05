/**
 * inject-stylesheets.js
 * Adds responsive.css and tailwind.css <link> tags to every HTML file
 * in the project. Detects whether the file is in the root or pages/ dir
 * and uses the correct relative path.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

// Files in root (one level up from assets/)
const rootFiles = ['index.html'];

// Files in pages/ (two levels up from assets/ via ../)
const pagesDir = path.join(projectRoot, 'pages');
const pageFiles = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(pagesDir, f));

function injectLinks(filePath, assetsPath) {
    let content = fs.readFileSync(filePath, 'utf8');

    const tailwindLink = `<link rel="stylesheet" href="${assetsPath}/css/tailwind.css">`;
    const responsiveLink = `<link rel="stylesheet" href="${assetsPath}/css/responsive.css">`;

    // Skip if already injected
    if (content.includes('responsive.css')) {
        console.log(`  Already has responsive.css — skipping: ${path.basename(filePath)}`);
        return;
    }

    // Find the closing </head> tag and inject before it
    if (content.includes('</head>')) {
        content = content.replace(
            '</head>',
            `    ${tailwindLink}\n    ${responsiveLink}\n</head>`
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✓ Injected: ${path.basename(filePath)}`);
    } else {
        console.log(`  ✗ No </head> found: ${path.basename(filePath)}`);
    }
}

console.log('\n→ Injecting stylesheets into root HTML files...');

// Root index.html
const rootIndexPath = path.join(projectRoot, 'index.html');
if (fs.existsSync(rootIndexPath)) {
    injectLinks(rootIndexPath, 'assets');
}

console.log('\n→ Injecting stylesheets into pages/*.html files...');

pageFiles.forEach(filePath => {
    injectLinks(filePath, '../assets');
});

console.log('\nDone! All HTML files updated.\n');
