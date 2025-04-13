// Function to generate code using the configured API
async function generateCode(prompt) {
    const apiSettings = getApiSettings();
    
    if (!apiSettings || !apiSettings.apiKey || !apiSettings.apiEndpoint) {
        throw new Error('API not configured. Please configure API settings.');
    }
    
    // Prepare the prompt
    const fullPrompt = `
You are a web developer creating a simple webpage. Based on the following description, generate HTML, CSS, and JavaScript code.

DESCRIPTION:
${prompt}

REQUIREMENTS:
1. The HTML should be valid and well-structured
2. The CSS should be clean and responsive
3. If JavaScript functionality is mentioned, include necessary JavaScript
4. No frameworks or external libraries unless specifically requested

RESPONSE FORMAT:
Return ONLY three code blocks with HTML, CSS, and JavaScript.

For the HTML, start with <!DOCTYPE html> and include proper head and body sections.
Avoid adding unnecessary comments except for structural clarity.
Ensure all code is functional and follows best practices.

HTML CODE:
\`\`\`html
// HTML code here
\`\`\`

CSS CODE:
\`\`\`css
// CSS code here
\`\`\`

JAVASCRIPT CODE:
\`\`\`javascript
// JavaScript code here
\`\`\`
`;

    try {
        let response;
        
        // Handle different API providers
        switch(apiSettings.provider) {
            case 'openai':
                response = await callOpenAI(fullPrompt, apiSettings);
                break;
            case 'anthropic':
                response = await callAnthropic(fullPrompt, apiSettings);
                break;
            case 'custom':
                response = await callCustomAPI(fullPrompt, apiSettings);
                break;
            default:
                throw new Error('Unknown API provider');
        }
        
        // Parse the response to extract code blocks
        return parseCodeResponse(response);
    } catch (error) {
        console.error('API request failed:', error);
        throw new Error(`Failed to generate code: ${error.message}`);
    }
}

// Call OpenAI API
async function callOpenAI(prompt, apiSettings) {
    const response = await fetch(apiSettings.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiSettings.apiKey}`
        },
        body: JSON.stringify({
            model: apiSettings.modelName || 'gpt-4',
            messages: [
                { role: 'system', content: 'You are a helpful web development assistant.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// Call Anthropic API
async function callAnthropic(prompt, apiSettings) {
    const response = await fetch(apiSettings.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiSettings.apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: apiSettings.modelName || 'claude-3-opus-20240229',
            max_tokens: 4000,
            messages: [
                { role: 'user', content: prompt }
            ]
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Anthropic API error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
}

// Call Custom API
async function callCustomAPI(prompt, apiSettings) {
    // For custom APIs, we'll use a generic approach that can be customized
    const response = await fetch(apiSettings.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiSettings.apiKey}`
        },
        body: JSON.stringify({
            model: apiSettings.modelName || 'default-model',
            prompt: prompt,
            max_tokens: 4000,
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    // This is a generic approach, may need customization based on the specific API
    if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content;
    } else if (data.text || data.content) {
        return data.text || data.content;
    } else {
        throw new Error('Unknown response format from custom API');
    }
}

// Function to parse code blocks from API response
function parseCodeResponse(response) {
    const result = {
        html: '',
        css: '',
        js: ''
    };
    
    // Extract HTML code
    const htmlMatch = response.match(/```html([\s\S]*?)```/);
    if (htmlMatch && htmlMatch[1]) {
        result.html = htmlMatch[1].trim();
    }
    
    // Extract CSS code
    const cssMatch = response.match(/```css([\s\S]*?)```/);
    if (cssMatch && cssMatch[1]) {
        result.css = cssMatch[1].trim();
    }
    
    // Extract JavaScript code
    const jsMatch = response.match(/```javascript([\s\S]*?)```/) || response.match(/```js([\s\S]*?)```/);
    if (jsMatch && jsMatch[1]) {
        result.js = jsMatch[1].trim();
    }
    
    return result;
}
