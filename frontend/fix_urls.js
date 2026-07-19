const fs = require('fs');
const path = require('path');

function fixInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixInDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            // Fix double processed process.env
            content = content.replace(/\(process\.env\.REACT_APP_API_URL \|\| "\$\{process\.env\.REACT_APP_API_URL \|\| "http:\/\/localhost:8080"}"\)/g, '(process.env.REACT_APP_API_URL || "http://localhost:8080")');
            // Check for any other anomalies, just to be safe
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed ' + fullPath);
            }
        }
    }
}
fixInDir(path.join(process.cwd(), 'src'));
console.log('Done fixing!');
