# self-commit

[![NPM Version](https://img.shields.io/npm/v/self-commit.svg)](https://www.npmjs.com/package/self-commit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/bruchave/self-commit)

> The agnostic copywriting assistant for structured git commits.

```bash
# Get started immediately
npx self-commit
```

---

## ✨ Why?

Git commit messages are often inconsistent, vague, or forgotten. **self-commit** fixes that by analyzing your code changes and generating structured, meaningful commit messages that explain **why** a change exists, not just **what** changed.

---

## 🚀 Features

- **🧠 AI-Assisted Copywriting:** Drafts intent-focused messages using GPT-4o-mini or Gemini 1.5.
- **🌍 Fully Agnostic:** Language-independent and supports multiple AI providers.
- **🛡️ Security First:** Built-in secret scanning (DLP) and sensitive file filtering.
- **🔑 Global Credential Store:** Securely save your API keys once; use them across all projects.
- **📋 Conventional Commits:** Strictly follows the standard and integrates with `commitlint`.
- **🛠️ Extensible Context:** Run architectural analysis commands to enrich the AI's understanding.

---

## 🏗️ Architecture

```mermaid
graph TD
    A[Staged Changes] -->|git diff| B(Security Filter)
    B -->|DLP Scan| C{Safe?}
    C -->|Yes| D[AI Service]
    C -->|No| E[Abort & Alert]
    F[Context Hook] -.->|External Data| D
    D -->|Prompt| G[AI Provider]
    G -->|Suggestion| H[Interactive CLI]
    H -->|Confirm| I[Git Commit]
```

---

## 📦 Installation

```bash
npm install -D self-commit
```

## 🔑 Setup

Set your API key once globally:

```bash
# For OpenAI
npx self-commit set-key openai sk-...

# For Gemini
npx self-commit set-key gemini AIza...
```

### Management

```bash
# Check configuration status
npx self-commit status

# Remove a global key
npx self-commit delete-key openai
```

---

## ⚙️ Usage

```bash
git add .
npx self-commit
```

### Configuration (`self-commit.config.json`)

```json
{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "language": "en",
  "verbosity": "normal",
  "contextCommand": "architecture-generate ."
}
```

---

## 🔒 Security

**self-commit** is built for professional environments:

- **Sensitive File Filtering:** Automatically excludes `.env`, `*.pem`, `*.key`, `package-lock.json`, etc.
- **Content-Based Scanning:** Aborts analysis if API keys or tokens are detected in the diff.
- **Injection Protection:** Strict validation of external context commands.
- **Data Privacy:** Only the diff of allowed files is sent to your selected provider.

> [!IMPORTANT]
> Always audit your changes for hardcoded secrets before staging.

---

## 🧠 Manifesto

Writing commit messages is part of thinking. Most commits today are rushed, inconsistent, and disconnected from real intent.

**self-commit** treats commits as structured expressions of intent. By turning code changes into structured data, we power the foundation for **self-graph**—enabling historical analysis and a deeper understanding of developer evolution.

---

## 📄 License

MIT
