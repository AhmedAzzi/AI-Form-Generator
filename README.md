# 🤖 AI Google Form Generator

> **Transform plain-language descriptions into fully functional Google Forms — powered by Gemini AI.**

A modern, bilingual web app that takes your natural-language description, generates a ready-to-paste Google Sheets table and production-ready Apps Script code, and lets you create a Google Form in minutes — no coding required.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌍 **Bilingual UI** | Instantly switch between English and Arabic (full RTL/LTR support) |
| 📝 **Natural Language Input** | Describe your form in plain language — the AI handles the rest |
| 📋 **Google Sheets Table** | One-click copy of a formatted table, ready to paste into Google Sheets |
| 💻 **Apps Script Code** | Production-ready Google Apps Script with syntax highlighting |
| 🧠 **Model Selection** | Choose between Gemini 1.5 Flash, 2.0 Flash, 2.5 Flash, or 3 Flash |
| 🎨 **3 Themes** | Default, Dark, and Neon — all with glassmorphism effects |
| ⚡ **Retry Logic** | Automatic retries with exponential backoff for API reliability |
| 📱 **Responsive** | Works beautifully on desktop, tablet, and mobile |

---

## 🚀 Complete Onboarding Guide

Follow this guide from start to finish to generate your first Google Form.

### Overview of the Process

```
You describe a form  →  AI generates table + code  →  You paste into Google Sheets  →  Run the script  →  Your form is live!
```

---

### Step 1: Open the App

1. Download or clone this repository.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
3. No installation, no build step, no server required — it just works.

> 💡 **Tip:** For the best experience, use Google Chrome.

---

### Step 2: Get Your Gemini API Key

You need a free API key from Google to power the AI generation.

1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2. Sign in with your Google account.
3. Click **"Create API Key"**.
4. Copy the generated key (it looks like `AIzaSy...`).

> ⚠️ **Important:** Keep your API key private. Never share it publicly or commit it to a repository.

---

### Step 3: Configure the App Settings

1. Click the **⚙️ gear icon** in the top-right corner of the app.
2. In the Settings modal:
   - **Gemini API Key** — Paste your API key here.
   - **AI Model** — Select your preferred model:
     | Model | Best For |
     |---|---|
     | Gemini 1.5 Flash | Legacy support, very stable |
     | Gemini 2.0 Flash | Good balance of speed and quality |
     | **Gemini 2.5 Flash** ⭐ | Recommended — best quality for form generation |
     | Gemini 3 Flash (Preview) | Bleeding edge, may be less stable |
   - **Theme** — Choose Default, Dark, or Neon.
3. Click **"Save Settings"**.

> 💡 **Tip:** Your settings are saved locally in your browser. You won't need to re-enter them next time.

---

### Step 4: Describe Your Form

In the main input area, describe the form you want in plain, natural language.

#### ✅ Good Prompt Examples

**Example 1 — Simple Feedback Form:**
```
Create a customer feedback form with:
- Full name (required)
- Email address (required)
- Satisfaction rating from 1 to 5 (required, multiple choice)
- Which services did you use: Support, Sales, Billing, Other (checkboxes)
- Additional comments (optional, long text)
```

**Example 2 — Event Registration:**
```
I need an event registration form with:
- Participant name (required)
- Phone number (required)
- T-shirt size: S, M, L, XL (required, multiple choice)
- Dietary restrictions: Vegetarian, Vegan, Gluten-free, None (checkboxes, optional)
- Any special requests (optional paragraph)
```

**Example 3 — Quiz:**
```
Make a geography quiz with:
- What is the capital of France? Options: London, Paris, Berlin, Madrid (required, multiple choice)
- Which countries are in Europe? Options: Germany, Japan, Italy, Brazil (required, checkboxes)
- Describe the climate of your country (required, paragraph)
```

#### ❌ Bad Prompt Examples (and How to Fix Them)

| Bad Prompt | Problem | Better Version |
|---|---|---|
| "Make a form" | Too vague — no questions specified | "Make a form with name, email, and a rating from 1-5" |
| "Survey" | Single word — AI can't infer what you need | "Create a survey about employee satisfaction with 5 questions" |
| "Form with many fields" | No specifics about field types or content | "Form with name (text), department (multiple choice: HR, IT, Sales), and feedback (paragraph)" |

> 💡 **Tip:** The more specific you are about question types (text, multiple choice, checkboxes, paragraph), the better the results.

---

### Step 5: Generate the Form

1. Click the **✨ Generate Form** button (or press `Ctrl + Enter`).
2. Wait for the AI to process your request (usually 5–15 seconds).
3. Two output cards will appear:
   - **📋 Generated Table** — A formatted table with all your form questions.
   - **💻 Generated Script** — The Google Apps Script code to create the form.

> 💡 **Tip:** If the generation fails, the app will automatically retry up to 3 times. If it still fails, check your API key and internet connection.

---

### Step 6: Create a Google Sheet

1. Go to **[Google Sheets](https://sheets.google.com)** and create a **new blank spreadsheet**.
2. Give it a descriptive name (e.g., "My Feedback Form Data").

---

### Step 7: Paste the Table

1. Back in the AI Form Generator app, click the **📋 Copy Table** button on the Generated Table card.
2. Go to your Google Sheet.
3. Click on cell **A1**.
4. Paste (`Ctrl + V` or `Cmd + V`).

Your sheet should now look like this:

| Question | Type | Required | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|---|---|
| Full Name | text | true | | | | |
| Email | text | true | | | | |
| Satisfaction | mcq | true | 1 | 2 | 3 | 4 |
| Services Used | checkbox | false | Support | Sales | Billing | Other |
| Comments | paragraph | false | | | | |

#### Understanding the Table Columns

| Column | Description | Valid Values |
|---|---|---|
| **Question** | The question text shown to users | Any text |
| **Type** | The type of input field | `text`, `paragraph`, `mcq`, `checkbox` |
| **Required** | Whether the question is mandatory | `true` or `false` |
| **Option 1–4** | Choices for mcq/checkbox questions | Any text (leave blank for text/paragraph) |

---

### Step 8: Add the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**.
2. This opens the Apps Script editor in a new tab.
3. **Delete** all the default code in the editor (select all → delete).
4. Back in the AI Form Generator app, click the **📋 Copy Code** button on the Generated Script card.
5. **Paste** the copied code into the Apps Script editor.
6. Click the **💾 Save** button (or `Ctrl + S`).

---

### Step 9: Run the Script

1. In the Apps Script editor, make sure the function **`createFormFromSheet`** is selected in the function dropdown (top toolbar).
2. Click the **▶️ Run** button.
3. **First time only:** Google will ask you to authorize the script:
   - Click **"Review Permissions"**.
   - Select your Google account.
   - Click **"Advanced"** → **"Go to [project name] (unsafe)"**.
   - Click **"Allow"**.
4. Wait a few seconds for the script to finish executing.

---

### Step 10: Access Your Form

1. After the script runs, go to **View → Logs** (or press `Ctrl + Enter` in the Apps Script editor).
2. You'll see a URL like: `https://docs.google.com/forms/d/e/XXXX/edit`
3. **Click the link** — your Google Form is now live! 🎉

> 💡 **Tip:** The log shows the **edit URL**. To share the form with respondents, click **"Send"** in the Google Forms editor and copy the shareable link.

---

## 🔧 Troubleshooting

### Common Errors and How to Fix Them

| Error | Cause | Solution |
|---|---|---|
| **"Please set your API key"** | No API key configured | Open Settings (⚙️) and paste your Gemini API key |
| **"HTTP 400: Bad Request"** | Invalid API key format | Double-check your key — it should start with `AIzaSy` |
| **"HTTP 429: Too Many Requests"** | Rate limit exceeded | Wait 30–60 seconds and try again (auto-retry is built in) |
| **"HTTP 403: Forbidden"** | API key restrictions | Ensure your key has the "Generative Language API" enabled |
| **"Request timed out"** | Slow network or overloaded API | Check your internet connection and try again |
| **"No table found"** | AI response didn't match expected format | Rephrase your prompt with more specific details |
| **"No code found"** | AI returned only text, no code block | Retry — this is rare and usually resolves on the second attempt |
| **Script error: "TypeError"** | Table data wasn't pasted correctly | Ensure the table starts in cell A1 with headers in row 1 |
| **"Authorization required"** | Normal first-run behavior | Follow the authorization steps in Step 9 |

### Script-Specific Errors in Apps Script

| Error | Cause | Solution |
|---|---|---|
| `Exception: No item with name` | Empty question text in the table | Check for blank rows in your spreadsheet |
| `Exception: setChoiceValues` | MCQ/checkbox question has no options | Add at least one option in the Option columns |
| `TypeError: Cannot read property` | Sheet structure doesn't match expected format | Verify headers match: Question, Type, Required, Option 1–4 |

---

## 🌐 Language Support

- Click **English** or **العربية** in the header bar to switch the interface language.
- All labels, placeholders, buttons, and messages update instantly.
- You can write your form description in **any language** — the AI understands both English and Arabic prompts.

---

## 🎨 Themes

| Theme | Style |
|---|---|
| **Default** | Deep purple gradient with glassmorphism |
| **Dark** | Minimal dark mode with subtle contrasts |
| **Neon** | Vibrant cyan and magenta with glow effects |

Change your theme anytime from **Settings → Theme**.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` | Generate form |
| `Escape` | Close settings modal |

---

## 🛠️ Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — No frameworks, no dependencies to install
- **[Gemini API](https://ai.google.dev/)** — Generative AI for form creation
- **[Font Awesome 6](https://fontawesome.com/)** — Icons
- **[Prism.js](https://prismjs.com/)** — Syntax highlighting for generated code

---

## 📁 Project Structure

```
AI-Form-Generator/
├── index.html      # Main application page
├── style.css       # All styles, themes, and responsive design
├── script.js       # Application logic, API calls, and rendering
├── README.md       # This file
└── LICENSE         # MIT License
```

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<div align="center">

**Made with ❤️ for form creators everywhere**

*Describe it. Generate it. Share it.*

</div>
