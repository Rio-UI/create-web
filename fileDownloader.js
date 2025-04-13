// Function to download files
function downloadFiles(htmlCode, cssCode, jsCode) {
    const zip = new JSZip();
    
    // Add files to the zip
    zip.file('index.html', createStandaloneHtml(htmlCode, cssCode, jsCode));
    zip.file('styles.css', cssCode);
    zip.file('script.js', jsCode);
    
    // Generate zip file
    zip.generateAsync({ type: 'blob' })
        .then(function(content) {
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(content);
            downloadLink.download = 'web-app.zip';
            
            // Add to document, click, and remove
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
}

// Function to create standalone HTML with proper references
function createStandaloneHtml(htmlCode, cssCode, jsCode) {
    // Create a properly formatted standalone HTML file
    // that references external CSS and JS files
    
    // Extract the content between <body> tags
    let bodyContent = '';
    const bodyMatch = htmlCode.match(/<body>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
        bodyContent = bodyMatch[1];
    }
    
    // Create the standalone HTML
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Web Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
${bodyContent || '<!-- Generated content will appear here -->'}

    <script src="script.js"></script>
</body>
</html>`;
}
