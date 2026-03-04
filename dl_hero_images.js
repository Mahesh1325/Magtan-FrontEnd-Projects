const https = require('https');
const fs = require('fs');
const path = require('path');
const imgDir = path.join(__dirname, 'assets', 'img');

// Better images:
// Services → A serene, luxury spa/wellness treatment room (warm, soft, premium feel)
// Contact  → A welcoming modern office reception / front desk interior
const images = {
    // Services: luxury float spa room with warm water/light tones
    'hero-services.jpg': 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=85&w=1600',
    // Contact: warm, inviting modern reception / interior lobby
    'hero-contact.jpg': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=85&w=1600',
};

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                file.close(); fs.unlinkSync(dest);
                download(res.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
        }).on('error', err => { fs.unlink(dest, () => { }); reject(err); });
    });
}

(async () => {
    for (const [name, url] of Object.entries(images)) {
        const dest = path.join(imgDir, name);
        await download(url, dest);
        console.log(`✓ ${name} (${Math.round(fs.statSync(dest).size / 1024)}KB)`);
    }
    console.log('Done!');
})();
