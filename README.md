# Ask the RepoAI

Connect a GitHub repository, ask questions about its code, and follow recent changes with concise commit summaries.

---

## ⚙️ Installation

1. Copy `.env.example` to `.env` and set your Clerk credentials, `DATABASE_URL`, and OpenRouter API key. `NVIDIA_API_KEY` is accepted as an alias for `OPENROUTER_API_KEY`.
2. Set `DATABASE_URL_POOLED` to your provider's pooled connection string for runtime use. Keep `DATABASE_URL` as the direct connection for Prisma CLI and migrations.
3. Install dependencies and initialize the database:

```bash
bun install
./start-database.sh # optional, for local Postgres
bun run db:push
```

Start the app:

```bash
bun run dev
```

Open [localhost:3000](http://localhost:3000).

The chat model is `nvidia/nemotron-3-ultra-550b-a55b:free`. Repository vectors use OpenRouter's free Nemotron embedding model. Use **Refresh repository index** on the dashboard after pushing code changes. Free NVIDIA endpoints may log prompts for security and model improvement; avoid connecting repositories with confidential source code.

#🤝 Contributing
Contributions are welcome! Here's how:

Fork the repository

Create a new branch (git checkout -b feature-name)

Commit your changes (git commit -m 'add some feature')

Push to the branch (git push origin feature-name)

Open a pull request


