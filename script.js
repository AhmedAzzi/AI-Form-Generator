// Application State
let appState = {
    apiKey: '',
    theme: 'default',
    model: 'gemini-1.5-flash',
    isGenerating: false,
    maxRetries: 3,
    timeoutMs: 45000 // 45 seconds timeout
};

// Enhanced System Prompt for AI - Google Forms Generator
const systemPrompt = `You are an expert AI assistant that generates Google Forms from natural language requests with ZERO tolerance for errors.

CRITICAL REQUIREMENTS - FAILURE TO FOLLOW THESE EXACTLY WILL BREAK THE APPLICATION:

### OUTPUT FORMAT (STRICT ORDER):
1. Google Sheet Table (Markdown format)
2. Google Apps Script Code (JavaScript code block)
3. NO explanations, comments, or additional text

---

### 1. GOOGLE SHEET TABLE SPECIFICATIONS

Generate EXACTLY this table structure:
| Question | Type | Required | Option 1 | Option 2 | Option 3 | Option 4 |

**MANDATORY FIELD VALUES (Case-sensitive)**:

**Type** - Use EXACTLY these values (lowercase only):
- text       → Short answer field
- paragraph  → Long answer field  
- mcq        → Multiple choice (single selection)
- checkbox   → Multiple selection checkboxes

**Required** - Use EXACTLY these values (lowercase only):
- true       → Question is mandatory
- false      → Question is optional

**Options** - For mcq/checkbox types only:
- Fill Option 1, Option 2, etc. with actual choice text
- Leave empty cells blank (not "N/A" or "-")
- For text/paragraph types, leave ALL option columns empty

---

### 2. GOOGLE APPS SCRIPT CODE REQUIREMENTS

Write production-ready JavaScript code that:

**FUNCTION STRUCTURE:**

function createFormFromSheet() {
    // Your implementation here
}

**MANDATORY IMPLEMENTATION STEPS:**
1. Get active sheet: SpreadsheetApp.getActiveSheet()
2. Read data starting from row 2: sheet.getDataRange().getValues()
3. Create form: \`FormApp.create('Form Title')\`
4. Process each row with proper validation
5. Log edit URL: \`Logger.log(form.getEditUrl())\`

**QUESTION TYPE MAPPING (Use exact method names):**
- text → \`form.addTextItem()\`
- paragraph → \`form.addParagraphTextItem()\`  
- mcq → \`form.addMultipleChoiceItem()\`
- checkbox → \`form.addCheckboxItem()\`

**CHOICE HANDLING FOR mcq/checkbox:**
- Collect non-empty options from columns 3–6 (Option 1–4)
- Use \`.setChoiceValues(arrayOfChoices)\` method
- Filter out empty/null values before setting choices

**REQUIRED FIELD HANDLING:**
- Read Required column value as string
- Convert to boolean: \`required === 'true'\`
- Apply: \`.setRequired(booleanValue)\`

**ERROR PREVENTION RULES:**
- Check if question text is not empty before adding
- Validate question type before processing
- Ensure choices array has at least 1 item for mcq/checkbox
- Handle empty cells gracefully
- Use proper JavaScript boolean values (true/false, not TRUE/FALSE)

**FORBIDDEN METHODS (Will cause runtime errors):**
- Do NOT use \`FormApp.createChoice()\`
- Do NOT use \`form.addChoice()\`
- Do NOT use uppercase TRUE/FALSE

**CODE STRUCTURE TEMPLATE:**
\`\`\`javascript
function createFormFromSheet() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const form = FormApp.create('Your Form Title');

    for (let i = 1; i < data.length; i++) {
        const [question, type, required, opt1, opt2, opt3, opt4] = data[i];

        if (!question || question.toString().trim() === '') continue;

        const isRequired = required.toString().toLowerCase() === 'true';

        // Handle each question type with proper validation
        // ... your implementation
    }

    Logger.log('Form created: ' + form.getEditUrl());
}
\`\`\`

**QUALITY CHECKLIST:**
- All string comparisons use toLowerCase()
- Boolean values are lowercase (true/false)
- Empty cell handling is implemented
- Question text validation exists  
- Choice arrays are filtered for non-empty values
- Form URL is logged at the end
- No syntax errors or typos
- Code follows Google Apps Script best practices

---

### RESPONSE FORMAT EXAMPLE:

| Question       | Type     | Required | Option 1 | Option 2 | Option 3 | Option 4 |
|----------------|----------|----------|----------|----------|----------|----------|
| Your Name      | text     | true     |          |          |          |          |
| Favorite Color | mcq      | false    | Red      | Blue     | Green    | Yellow   |

\`\`\`javascript
function createFormFromSheet() {
  // Your complete, error-free implementation here
}
\`\`\`

REMEMBER: The user's application depends on this code working perfectly. One syntax error or case mismatch will break their entire workflow.`;


// DOM Elements
const elements = {
    prompt: null,
    apiKey: null,
    output: null,
    outputSection: null,
    settingsModal: null,
    loadingOverlay: null,
    toastContainer: null,
    charCount: null,
    modelSelect: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function () {
    initializeElements();
    loadSettings();
    setupEventListeners();
    updateCharCount();
});

// Initialize DOM Elements
function initializeElements() {
    elements.prompt = document.getElementById('prompt');
    elements.apiKey = document.getElementById('apiKey');
    elements.output = document.getElementById('output');
    elements.outputSection = document.getElementById('outputSection');
    elements.settingsModal = document.getElementById('settingsModal');
    elements.loadingOverlay = document.getElementById('loadingOverlay');
    elements.toastContainer = document.getElementById('toastContainer');
    elements.charCount = document.querySelector('.char-count');
    elements.modelSelect = document.getElementById('modelSelect');
}

// Setup Event Listeners
function setupEventListeners() {
    // Character count for prompt
    elements.prompt.addEventListener('input', updateCharCount);

    // Modal close on outside click
    elements.settingsModal.addEventListener('click', function (e) {
        if (e.target === elements.settingsModal) {
            closeSettings();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            generateForm();
        }

        // Escape to close modal
        if (e.key === 'Escape') {
            closeSettings();
        }
    });
}

// Update Character Count
function updateCharCount() {
    if (!elements.prompt || !elements.charCount) return;
    const count = elements.prompt.value.length;
    const lang = document.documentElement.lang || 'en';
    const unit = lang === 'ar' ? 'أحرف' : 'characters';
    elements.charCount.textContent = `${count} ${unit}`;
}

// Toggle Guide Section
function toggleGuide() {
    const guideSection = document.getElementById('guideSection');
    const btn = document.getElementById('guideToggleBtn');
    if (!guideSection) return;

    const isHidden = guideSection.style.display === 'none';
    guideSection.style.display = isHidden ? 'block' : 'none';

    if (isHidden) {
        // Animate in
        guideSection.style.opacity = '0';
        guideSection.style.transform = 'translateY(-20px)';
        requestAnimationFrame(() => {
            guideSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            guideSection.style.opacity = '1';
            guideSection.style.transform = 'translateY(0)';
        });
        btn.classList.add('active');
        guideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        btn.classList.remove('active');
    }
}

// Settings Management
function openSettings() {
    elements.settingsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSettings() {
    elements.settingsModal.classList.remove('active');
    document.body.style.overflow = '';
}

function saveSettings() {
    appState.apiKey = elements.apiKey.value.trim();
    appState.model = elements.modelSelect.value;

    // Save to localStorage
    try {
        const settings = {
            apiKey: appState.apiKey,
            theme: appState.theme,
            model: appState.model
        };
        localStorage.setItem('formGeneratorSettings', JSON.stringify(settings));
        showToast(document.documentElement.lang === 'ar' ? 'تم حفظ الإعدادات بنجاح!' : 'Settings saved successfully!', 'success');
    } catch (error) {
        showToast(document.documentElement.lang === 'ar' ? 'فشل حفظ الإعدادات' : 'Failed to save settings', 'error');
        console.error('Error saving settings:', error);
    }

    closeSettings();
}

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('formGeneratorSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            appState.apiKey = settings.apiKey || '';
            appState.theme = settings.theme || 'default';
            appState.model = settings.model || 'gemini-1.5-flash';

            // Apply loaded settings
            elements.apiKey.value = appState.apiKey;
            if (elements.modelSelect) elements.modelSelect.value = appState.model;
            setTheme(appState.theme);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Theme Management
function setTheme(theme) {
    appState.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    // Update theme selector buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
}

// Password Toggle
function togglePassword() {
    const input = elements.apiKey;
    const button = document.querySelector('.toggle-password');
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Toast Notifications
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type} `;

    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    // Auto remove toast
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'info': return 'fas fa-info-circle';
        default: return 'fas fa-info-circle';
    }
}

// Loading State Management
function showLoading() {
    elements.loadingOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    elements.loadingOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Main Form Generation Function
async function generateForm() {
    const prompt = elements.prompt.value.trim();

    // Validation
    if (!prompt) {
        showToast('Please describe your form first!', 'error');
        elements.prompt.focus();
        return;
    }

    if (!appState.apiKey) {
        showToast('Please set your API key in settings first!', 'error');
        openSettings();
        return;
    }

    if (appState.isGenerating) {
        return; // Prevent multiple simultaneous requests
    }

    appState.isGenerating = true;
    showLoading();

    try {
        const result = await callGeminiAPIWithRetry(prompt);
        displayResult(result);
        showToast(document.documentElement.lang === 'ar' ? 'تم إنشاء النموذج بنجاح!' : 'Form generated successfully!', 'success');
    } catch (error) {
        console.error('Generation error:', error);
        showToast(`${document.documentElement.lang === 'ar' ? 'فشل إنشاء النموذج' : 'Failed to generate form'}: ${error.message} `, 'error');
    } finally {
        appState.isGenerating = false;
        hideLoading();
    }
}

// Gemini API Call with Retry Logic
async function callGeminiAPIWithRetry(userPrompt, retryCount = 0) {
    try {
        return await callGeminiAPI(userPrompt);
    } catch (error) {
        const isRetryable = error.message.includes('429') || error.message.includes('500') || error.message.includes('503') || error.message.includes('timeout');

        if (isRetryable && retryCount < appState.maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000;
            console.warn(`API call failed, retrying in ${delay}ms... (Attempt ${retryCount + 1}/${appState.maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return await callGeminiAPIWithRetry(userPrompt, retryCount + 1);
        }
        throw error;
    }
}

// Gemini API Call
async function callGeminiAPI(userPrompt) {
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [{
                    text: systemPrompt + "\n\nUser prompt:\n" + userPrompt
                }]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), appState.timeoutMs);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${appState.model}:generateContent?key=${appState.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(message);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from API');
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out after 45 seconds');
        }
        throw error;
    }
}

// Display Result
function displayResult(result) {
    const isAr = document.documentElement.lang === 'ar';

    // Extract table and code blocks from result with more robust regex
    const tableMatch = result.match(/(\|[^\n]+\|\n\|[\s:-|]+\|\n(?:\|[^\n]+\|\n?)+)/);
    const codeMatch = result.match(/```(?:javascript|js)?\s*\n([\s\S]*?)```/i);

    // Render table
    const tableOutput = document.getElementById('output-table');
    if (tableMatch) {
        tableOutput.innerHTML = processMarkdownTable(tableMatch[1]);
    } else {
        tableOutput.innerHTML = `<span style="color:#ffcc00">${isAr ? 'لم يتم العثور على جدول.' : 'No table found in AI response.'}</span>`;
    }

    // Render code
    const codeOutput = document.getElementById('output-code');
    if (codeMatch) {
        const code = codeMatch[1].trim();
        // Basic validation for Apps Script
        if (!code.includes('function createFormFromSheet')) {
            console.warn('Generated code might be missing the required entry point function.');
        }

        codeOutput.innerHTML = `<pre><code class="language-javascript">${escapeHtml(code)}</code></pre>`;
        if (window.Prism) {
            Prism.highlightElement(codeOutput.querySelector('code'));
        }
    } else {
        codeOutput.innerHTML = `<span style="color:#ffcc00">${isAr ? 'لم يتم العثور على سكريبت.' : 'No code block found in AI response.'}</span>`;
    }

    // Add copy event listeners
    const tableBtn = document.getElementById('copy-table-tsv-btn');
    if (tableBtn && tableMatch) {
        tableBtn.onclick = function () {
            const tsv = markdownTableToTSV(tableMatch[1]);
            copyTextToClipboard(tsv);
            showToast(isAr ? 'تم نسخ الجدول لـ Google Sheets!' : 'Table copied for Google Sheets!', 'success');
        };
    }

    const codeBtn = document.getElementById('copy-code-btn');
    if (codeBtn && codeMatch) {
        codeBtn.onclick = function () {
            copyTextToClipboard(codeMatch[1].trim());
            showToast(isAr ? 'تم نسخ السكريبت!' : 'Code copied to clipboard!', 'success');
        };
    }

    elements.outputSection.style.display = 'block';
    elements.outputSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Convert markdown table to TSV for Google Sheets
function markdownTableToTSV(md) {
    const lines = md.trim().split('\n');
    if (lines.length < 3) return '';

    // Filter out separator line
    const filtered = lines.filter((line, idx) => idx !== 1);

    return filtered.map(line => {
        // More robust splitting: only split on | that are not escaped or inside code
        const cells = line.split('|')
            .slice(1, -1) // Remove outer pipes
            .map(cell => cell.trim());
        return cells.join('\t');
    }).join('\n');
}

// Utility function to copy text to clipboard
function copyTextToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// Process Markdown and Code Blocks
function processMarkdownAndCode(text) {
    let processed = text;

    // Process code blocks
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
        const lang = language || 'javascript';
        return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Process inline code
    processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Process markdown tables
    processed = processMarkdownTable(processed);

    // Process bold text
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Process italic text
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Process line breaks
    processed = processed.replace(/\n/g, '<br>');

    return processed;
}

// Process Markdown Tables
function processMarkdownTable(text) {
    const tableRegex = /\|(.+)\|\n\|[\s:-|]+\|\n((?:\|.+\|\n?)+)/g;

    return text.replace(tableRegex, (match, header, rows) => {
        const headerCells = header.split('|').map(cell => cell.trim()).filter((cell, i, arr) => i > 0 && i < arr.length - 1);
        const rowsArray = rows.trim().split('\n').map(row =>
            row.split('|').map(cell => cell.trim()).filter((cell, i, arr) => i > 0 && i < arr.length - 1)
        );

        let tableHtml = '<div class="table-container"><table class="markdown-table">';

        // Header
        tableHtml += '<thead><tr>';
        headerCells.forEach(cell => {
            tableHtml += `<th>${escapeHtml(cell)}</th>`;
        });
        tableHtml += '</tr></thead>';

        // Body
        tableHtml += '<tbody>';
        rowsArray.forEach(row => {
            tableHtml += '<tr>';
            // Use headerCells length to ensure alignment
            for (let i = 0; i < headerCells.length; i++) {
                tableHtml += `<td>${escapeHtml(row[i] || '')}</td>`;
            }
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table></div>';

        return tableHtml;
    });
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animation for toast slide out
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .table-container {
        overflow-x: auto;
        margin: 1rem 0;
    }
    
    .markdown-table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        overflow: hidden;
    }
    
    .markdown-table th,
    .markdown-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
    }
    
    .markdown-table th {
        background: rgba(102, 126, 234, 0.2);
        font-weight: 600;
        color: var(--primary-color);
    }
    
    .markdown-table tr:hover {
        background: rgba(255, 255, 255, 0.05);
    }
`;
document.head.appendChild(style);

// Add Prism.js for syntax highlighting
(function addPrism() {
    if (!document.getElementById('prismjs')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
        link.id = 'prismjs';
        document.head.appendChild(link);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
        script.onload = function () {
            if (window.Prism) Prism.highlightAll();
        };
        document.body.appendChild(script);
    }
})();