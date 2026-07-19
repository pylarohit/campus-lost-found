const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('http://localhost:8080')) {
                // Let's create a global config import or just use process.env directly.
                // Actually, replacing literally with \\\ is safe if it's inside template literals, but if it's inside double quotes like "http://localhost:8080/api/login"
                // It's safer to just replace it with an imported constant, or since we are in create-react-app, we can use process.env directly.
                // Let's replace "http://localhost:8080" with process.env.REACT_APP_API_URL || "http://localhost:8080"
                // For template strings http://localhost:8080... we replace with ${process.env.REACT_APP_API_URL || 'http://localhost:8080'}...
                
                content = content.replace(/"http:\/\/localhost:8080/g, '(process.env.REACT_APP_API_URL || "http://localhost:8080") + "');
                content = content.replace(/http:\/\/localhost:8080/g, '${process.env.REACT_APP_API_URL || "http://localhost:8080"}');
                content = content.replace(/'http:\/\/localhost:8080/g, '(process.env.REACT_APP_API_URL || "http://localhost:8080") + \'');
                
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated ' + fullPath);
            }
        }
    }
}
replaceInDir(path.join(process.cwd(), 'src'));
console.log('Done!');
