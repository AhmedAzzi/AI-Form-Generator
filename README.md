# AI Google Form Generator

A modern web app to generate Google Forms and Apps Script code from natural language prompts, supporting both English and Arabic users.

## Features
- 🌍 **Bilingual UI:** Instantly switch between English and Arabic (RTL/LTR support)
- 📝 **Natural Language Input:** Describe your form in plain language
- 📋 **Google Sheets Table:** Copy a ready-to-paste table for Google Sheets
- 💻 **Apps Script Code:** Copy production-ready code for Google Apps Script
- 🧑‍💻 **Syntax Highlighting:** Beautiful code highlighting (like VS Code)
- 🎨 **Themes:** Choose from Default, Dark, or Neon themes
- 🔑 **Gemini API Integration:** Uses Gemini AI for prompt-to-form conversion
- 📱 **Responsive Design:** Works on desktop and mobile

## Getting Started

### 1. Clone or Download
```bash
git clone <your-repo-url>
cd Google-Form-Builder
```

### 2. Open the App
Just open `index.html` in your browser. No build step required.

### 3. Get a Gemini API Key
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Sign in and generate an API key
- Paste your key in the app settings

### 4. Usage
1. **Describe your form** in the input box (in English or Arabic)
2. Click **Generate Form**
3. Copy the generated table (for Google Sheets) and code (for Apps Script) using the provided buttons
4. Paste the table into a new Google Sheet
5. Paste the code into the Sheet's **Extensions → Apps Script** editor
6. Run the script to create your Google Form

## Language Support
- Click **English** or **العربية** in the header to switch the interface language
- All UI, placeholders, and labels update instantly

## Customization
- Change theme from the settings modal
- All styles are in `style.css`
- All logic is in `script.js`

## Tech Stack
- HTML5, CSS3, JavaScript (Vanilla)
- [Font Awesome](https://fontawesome.com/) for icons
- [Prism.js](https://prismjs.com/) for code highlighting

## Screenshots
![English UI](screenshots/english-ui.png)
![Arabic UI](screenshots/arabic-ui.png)

## License
MIT

---

**Made with ❤️ for form creators everywhere!**
