

# self-commit

The agnostic copywriting assistant for structured git commits.

```bash
npx self-commit
```

---

## ✨ Why?

Git commit messages are often:

- inconsistent  
- vague  
- forgotten  

**self-commit** fixes that by analyzing your actual code changes and generating structured, useful commit messages automatically.

---

## 🚀 Features

- **AI-Assisted Copywriting:** Drafts meaningful messages focused on intent (`why`) rather than just changes (`what`).
- **Fully Agnostic:** Language-independent and designed to support multiple AI providers.
- **Interactive Flow:** Refine, edit, or regenerate suggestions before committing.
- **Standardized:** Strictly follows **Conventional Commits**.
- **Fast and Lightweight:** Zero config required for the MVP.

---

## 📦 Installation

You can use it without installing:

```bash
npx self-commit
```

Or install locally:

```bash
npm install -D self-commit
```

---

## ⚙️ Usage

```bash
git add .
npx self-commit
```

What happens:

1. Reads your staged changes (`git diff --cached`)
2. Sends context to AI
3. Proposes a message (**Interactive Mode**)
4. You review, edit, and confirm the commit

---

## 🧠 Example

```bash
feat(api): add caching layer

- reduce response time
- improve scalability
```

---

## 🔒 Security

Sensitive files like `.env` should be ignored or filtered before sending data to AI.

> Never expose secrets in your commits or diffs.

---

## Roadmap

### v0.1 — Core
- Generate commit messages from staged changes (`git diff --cached`)
- Follow Conventional Commits format
- Interactive confirmation prompt
- Minimal CLI: `npx self-commit`

### v0.2 — Control
- `--dry` mode (preview without committing)
- basic error handling and fallbacks
- improve prompt engineering

### v0.3 — Configuration
- config file support (`self-commit.config.json`)
- custom model selection (Provider Agnostic)
- language and verbosity options

### v0.4 — Intelligence
- file-aware analysis (grouping changes by context)
- better scope detection

### v0.5 — Integration
- integration with architecture analysis tools
- enriched commit messages with structural context

### v1.0 — Platform
- foundation for integration with **self-graph**
- historical analysis of developer intent

---

## Manifesto

Writing commit messages is part of thinking.

Most commits today are:
- rushed
- inconsistent
- disconnected from real intent

A commit should explain why a change exists, not just what changed.

self-commit treats commits as structured expressions of intent.

Instead of writing messages manually, the system reads the code, understands the change, and generates a message that reflects:
- purpose
- impact
- context

Commits become:
- consistent
- meaningful
- comparable over time

This is not just about automation.

It is about turning code changes into data that can be:
- analyzed
- understood
- evolved

self-commit is a step toward turning commits into **structured data about developer intent**, powering the foundation for **self-graph**.

---

## 📄 License

MIT_