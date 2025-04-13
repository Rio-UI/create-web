document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const previewFrame = document.getElementById('previewFrame');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenModal = document.getElementById('fullscreenModal');
    const closeFullscreenBtn = document.getElementById('closeFullscreenBtn');
    const fullscreenFrame = document.getElementById('fullscreenFrame');
    const configuredApiText = document.getElementById('configuredApiText');
    
    // Tab navigation 
    const htmlTabBtn = document.getElementById('htmlTabBtn');
    const cssTabBtn = document.getElementById('cssTabBtn');
    const jsTabBtn = document.getElementById('jsTabBtn');
    
    // Default code content
    let htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Web Page</title>
    <style>
        /* CSS will be added here */
    </style>
</head>
<body>
    <!-- HTML content will appear here -->
    
    <script>
        // JavaScript will be added here
    </script>
</body>
</html>`;
    
    let cssCode = `/* CSS styles will appear here */
body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 20px;
    line-height: 1.6;
}`;
    
    let jsCode = `// JavaScript code will appear here
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
});`;

    // Initialize editors with default content
    initCodeMirrorEditors(htmlCode, cssCode, jsCode);
    
    // Render the initial preview
    updatePreview();
    
    // Update the API configuration text
    updateConfigurationText();
    
    // Event: Generate button click
    generateBtn.addEventListener('click', async function() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a description of the web page you want to generate.');
            return;
        }
        
        // Check if API is configured
        const apiSettings = getApiSettings();
        if (!apiSettings || !apiSettings.apiKey || !apiSettings.apiEndpoint) {
            alert('Please configure your API settings first.');
            return;
        }
        
        try {
            // Show loading overlay
            loadingOverlay.classList.remove('hidden');
            
            // Make API request
            const generatedCode = await generateCode(prompt);
            
            // Update editors with generated code
            if (generatedCode) {
                htmlCode = generatedCode.html || htmlCode;
                cssCode = generatedCode.css || cssCode;
                jsCode = generatedCode.js || jsCode;
                
                updateEditorContents(htmlCode, cssCode, jsCode);
                updatePreview();
            }
        } catch (error) {
            console.error('Error generating code:', error);
            alert('Error generating code: ' + error.message);
        } finally {
            // Hide loading overlay
            loadingOverlay.classList.add('hidden');
        }
    });
    
    // Tab switching logic
    htmlTabBtn.addEventListener('click', function() {
        setActiveTab('html');
    });
    
    cssTabBtn.addEventListener('click', function() {
        setActiveTab('css');
    });
    
    jsTabBtn.addEventListener('click', function() {
        setActiveTab('js');
    });
    
    // Fullscreen preview toggle
    fullscreenBtn.addEventListener('click', function() {
        fullscreenModal.classList.remove('hidden');
        const fullscreenDoc = fullscreenFrame.contentDocument || fullscreenFrame.contentWindow.document;
        fullscreenDoc.open();
        fullscreenDoc.write(getCombinedCode());
        fullscreenDoc.close();
    });
    
    closeFullscreenBtn.addEventListener('click', function() {
        fullscreenModal.classList.add('hidden');
    });
    
    // Download button
    document.getElementById('downloadBtn').addEventListener('click', function() {
        downloadFiles(htmlCode, cssCode, jsCode);
    });
    
    // Function to get combined code (HTML with embedded CSS and JS)
    function getCombinedCode() {
        // Create a copy of HTML, then inject CSS and JS
        let combinedHtml = htmlCode;
        
        // Inject CSS
        if (cssCode.trim()) {
            // Replace the style tag placeholder or add to head
            if (combinedHtml.includes('<style>')) {
                combinedHtml = combinedHtml.replace('<style>', '<style>\n' + cssCode);
            } else {
                combinedHtml = combinedHtml.replace('</head>', `<style>\n${cssCode}\n</style>\n</head>`);
            }
        }
        
        // Inject JS
        if (jsCode.trim()) {
            // Replace the script tag placeholder or add to body
            if (combinedHtml.includes('<script>')) {
                combinedHtml = combinedHtml.replace('<script>', '<script>\n' + jsCode);
            } else {
                combinedHtml = combinedHtml.replace('</body>', `<script>\n${jsCode}\n</script>\n</body>`);
            }
        }
        
        return combinedHtml;
    }
    
    // Function to update the preview iframe
    function updatePreview() {
        const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        previewDoc.open();
        previewDoc.write(getCombinedCode());
        previewDoc.close();
    }
    
    // Function to set active tab
    function setActiveTab(tab) {
        // Remove active class from all tabs
        htmlTabBtn.classList.remove('active-tab', 'bg-gray-100');
        cssTabBtn.classList.remove('active-tab', 'bg-gray-100');
        jsTabBtn.classList.remove('active-tab', 'bg-gray-100');
        
        // Set text color for all tabs
        htmlTabBtn.classList.add('text-gray-600');
        cssTabBtn.classList.add('text-gray-600');
        jsTabBtn.classList.add('text-gray-600');
        
        // Set active tab
        switch(tab) {
            case 'html':
                htmlTabBtn.classList.add('active-tab', 'bg-gray-100');
                htmlTabBtn.classList.remove('text-gray-600');
                showEditor('html');
                break;
            case 'css':
                cssTabBtn.classList.add('active-tab', 'bg-gray-100');
                cssTabBtn.classList.remove('text-gray-600');
                showEditor('css');
                break;
            case 'js':
                jsTabBtn.classList.add('active-tab', 'bg-gray-100');
                jsTabBtn.classList.remove('text-gray-600');
                showEditor('js');
                break;
        }
    }
    
    // Function to show the appropriate editor
    function showEditor(editor) {
        switch(editor) {
            case 'html':
                document.getElementById('htmlEditor').style.display = 'block';
                document.getElementById('cssEditor').style.display = 'none';
                document.getElementById('jsEditor').style.display = 'none';
                break;
            case 'css':
                document.getElementById('htmlEditor').style.display = 'none';
                document.getElementById('cssEditor').style.display = 'block';
                document.getElementById('jsEditor').style.display = 'none';
                break;
            case 'js':
                document.getElementById('htmlEditor').style.display = 'none';
                document.getElementById('cssEditor').style.display = 'none';
                document.getElementById('jsEditor').style.display = 'block';
                break;
        }
    }
    
    // Function to update configuration text
    function updateConfigurationText() {
        const apiSettings = getApiSettings();
        if (apiSettings && apiSettings.apiKey && apiSettings.apiEndpoint) {
            let provider = apiSettings.provider;
            if (provider === 'custom' && apiSettings.customProviderName) {
                provider = apiSettings.customProviderName;
            }
            configuredApiText.textContent = `${provider} (${apiSettings.modelName || 'Default model'})`;
        } else {
            configuredApiText.textContent = 'Not set';
        }
    }
    
    // Set HTML as the default active tab
    setActiveTab('html');
    
    // Listen for settings changes to update the UI
    window.addEventListener('apiSettingsUpdated', function() {
        updateConfigurationText();
    });
    
    // Listen for code editor changes to update preview
    window.addEventListener('codeEditorUpdated', function(e) {
        const { type, content } = e.detail;
        
        switch(type) {
            case 'html':
                htmlCode = content;
                break;
            case 'css':
                cssCode = content;
                break;
            case 'js':
                jsCode = content;
                break;
        }
        
        updatePreview();
    });
});
