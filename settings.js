document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const apiProvider = document.getElementById('apiProvider');
    const customProviderField = document.getElementById('customProviderField');
    const customProviderName = document.getElementById('customProviderName');
    const apiEndpoint = document.getElementById('apiEndpoint');
    const apiKey = document.getElementById('apiKey');
    const modelName = document.getElementById('modelName');
    
    // Load saved settings
    loadSettings();
    
    // Event: Settings button click - Show settings modal
    settingsBtn.addEventListener('click', function() {
        settingsModal.classList.remove('hidden');
    });
    
    // Event: Close settings button click - Hide settings modal
    closeSettingsBtn.addEventListener('click', function() {
        settingsModal.classList.add('hidden');
    });
    
    // Event: API Provider change - Show/hide custom provider field
    apiProvider.addEventListener('change', function() {
        if (apiProvider.value === 'custom') {
            customProviderField.classList.remove('hidden');
        } else {
            customProviderField.classList.add('hidden');
            
            // Set default endpoint based on provider
            if (apiProvider.value === 'openai') {
                apiEndpoint.value = 'https://api.openai.com/v1/chat/completions';
                modelName.value = 'gpt-4';
            } else if (apiProvider.value === 'anthropic') {
                apiEndpoint.value = 'https://api.anthropic.com/v1/messages';
                modelName.value = 'claude-3-opus-20240229';
            }
        }
    });
    
    // Event: Save settings button click
    saveSettingsBtn.addEventListener('click', function() {
        const settings = {
            provider: apiProvider.value,
            customProviderName: customProviderName.value,
            apiEndpoint: apiEndpoint.value,
            apiKey: apiKey.value,
            modelName: modelName.value
        };
        
        // Validate settings
        if (!settings.apiEndpoint) {
            alert('Please enter an API endpoint.');
            return;
        }
        
        if (!settings.apiKey) {
            alert('Please enter an API key.');
            return;
        }
        
        if (settings.provider === 'custom' && !settings.customProviderName) {
            alert('Please enter a name for your custom provider.');
            return;
        }
        
        // Save settings
        saveApiSettings(settings);
        
        // Dispatch event for other components to update
        window.dispatchEvent(new CustomEvent('apiSettingsUpdated'));
        
        // Close modal
        settingsModal.classList.add('hidden');
    });
    
    // Function to load saved settings
    function loadSettings() {
        const settings = getApiSettings();
        
        if (settings) {
            apiProvider.value = settings.provider || 'openai';
            customProviderName.value = settings.customProviderName || '';
            apiEndpoint.value = settings.apiEndpoint || '';
            apiKey.value = settings.apiKey || '';
            modelName.value = settings.modelName || '';
            
            // Show/hide custom provider field
            if (apiProvider.value === 'custom') {
                customProviderField.classList.remove('hidden');
            } else {
                customProviderField.classList.add('hidden');
            }
        }
    }
});

// Function to save API settings
function saveApiSettings(settings) {
    localStorage.setItem('apiSettings', JSON.stringify(settings));
}

// Function to get API settings
function getApiSettings() {
    const settings = localStorage.getItem('apiSettings');
    return settings ? JSON.parse(settings) : null;
}
