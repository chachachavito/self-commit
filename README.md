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

- **AI-Assisted Copywriting:** Drafts meaningful messages focused on intent (`why`) rather than just changes (`what`).
- **Fully Agnostic:** Language-independent and supports multiple AI providers (**OpenAI** & **Google Gemini**).
- **File-Aware Intelligence:** Automatically detects scopes based on changed file paths and structural context.
- **Interactive Flow:** Refine, edit, or regenerate suggestions before committing.
- **Configurable:** Customize provider, model, language, and verbosity via `self-commit.config.json`.
- **Standardized:** Strictly follows **Conventional Commits** and integrates with **Commitlint**.
- **Governance Ready:** Includes built-in support for **Husky** and **Lint-staged**.

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

### v0.1 — Core [DONE]

- Generate commit messages from staged changes (`git diff --cached`)
- Follow Conventional Commits format
- Interactive confirmation prompt
- Minimal CLI: `npx self-commit`

### v0.2 — Control [DONE]

- `--dry-run` mode
- Basic error handling and fallbacks
- Improved prompt engineering

### v0.3 — Configuration [DONE]

- Config file support (`self-commit.config.json`) via `cosmiconfig`
- Multi-provider support (OpenAI & Gemini)
- Language and verbosity options

### v0.4 — Intelligence [DONE]

- File-aware analysis (grouping changes by context)
- Automatic scope detection based on file paths

### v0.5 — Integration

- Integration with architecture analysis tools
- Enriched commit messages with structural context

### v1.0 — Platform

- Foundation for integration with **self-graph**
- Historical analysis of developer intent

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

MIT\_
