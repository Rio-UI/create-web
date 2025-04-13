// Function to initialize CodeMirror editors
function initCodeMirrorEditors(htmlCode, cssCode, jsCode) {
    // Create editor container elements
    const codeEditorContainer = document.getElementById('codeEditor');
    
    // Create individual editor containers
    const htmlEditorElement = document.createElement('div');
    htmlEditorElement.id = 'htmlEditor';
    htmlEditorElement.style.height = '100%';
    
    const cssEditorElement = document.createElement('div');
    cssEditorElement.id = 'cssEditor';
    cssEditorElement.style.height = '100%';
    cssEditorElement.style.display = 'none';
    
    const jsEditorElement = document.createElement('div');
    jsEditorElement.id = 'jsEditor';
    jsEditorElement.style.height = '100%';
    jsEditorElement.style.display = 'none';
    
    // Add editor elements to container
    codeEditorContainer.appendChild(htmlEditorElement);
    codeEditorContainer.appendChild(cssEditorElement);
    codeEditorContainer.appendChild(jsEditorElement);
    
    // Initialize HTML editor
    window.htmlEditor = CodeMirror(htmlEditorElement, {
        value: htmlCode,
        mode: 'htmlmixed',
        theme: 'github',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 4,
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        matchTags: { bothTags: true }
    });
    
    // Initialize CSS editor
    window.cssEditor = CodeMirror(cssEditorElement, {
        value: cssCode,
        mode: 'css',
        theme: 'github',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 4,
        autoCloseBrackets: true,
        matchBrackets: true
    });
    
    // Initialize JavaScript editor
    window.jsEditor = CodeMirror(jsEditorElement, {
        value: jsCode,
        mode: 'javascript',
        theme: 'github',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 4,
        autoCloseBrackets: true,
        matchBrackets: true
    });
    
    // Add change listeners to update preview on content change
    window.htmlEditor.on('change', function() {
        dispatchEditorUpdatedEvent('html', window.htmlEditor.getValue());
    });
    
    window.cssEditor.on('change', function() {
        dispatchEditorUpdatedEvent('css', window.cssEditor.getValue());
    });
    
    window.jsEditor.on('change', function() {
        dispatchEditorUpdatedEvent('js', window.jsEditor.getValue());
    });
    
    // Refresh editors to ensure proper sizing
    setTimeout(function() {
        window.htmlEditor.refresh();
        window.cssEditor.refresh();
        window.jsEditor.refresh();
    }, 100);
}

// Function to update the content of the editors
function updateEditorContents(htmlCode, cssCode, jsCode) {
    if (window.htmlEditor) {
        window.htmlEditor.setValue(htmlCode);
    }
    
    if (window.cssEditor) {
        window.cssEditor.setValue(cssCode);
    }
    
    if (window.jsEditor) {
        window.jsEditor.setValue(jsCode);
    }
}

// Function to dispatch an event when editor content is updated
function dispatchEditorUpdatedEvent(type, content) {
    window.dispatchEvent(new CustomEvent('codeEditorUpdated', {
        detail: {
            type: type,
            content: content
        }
    }));
}
