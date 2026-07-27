Use this workflow to initiate Phase 1 Discovery when starting a feature or project.

## Pre-Question Research Protocol (MANDATORY)

Before formulating ANY questions, you MUST scan the codebase:

1. Run `list_dir` on the project root — catalog all modules, directories, and key files.
2. Read `package.json` (or equivalent manifest) — identify the tech stack, build scripts, test framework, and dependencies.
3. Use `grep_search` to find existing patterns related to the user's request (e.g., route definitions, model schemas, test patterns).
4. Read 3–5 relevant source files to understand naming conventions, architectural patterns, and existing abstractions.
5. Check `.specs/.steering/` directory — read `decisions.md`, `stack.md`, and `conventions.md` to avoid re-asking previously settled questions.
6. Use `search_web` to research relevant libraries, APIs, or best practices that inform your questions.

## Question Formulation Rules

- Ask **EXACTLY 3 to 5 sharp, concise architectural questions**.
- Each question MUST reference a specific finding from your codebase scan (e.g., "I see you're using Express with Prisma ORM — should we...").
- Provide 2–4 concrete, opinionated options per question (not generic placeholders).
- Use `ask_question` tool with `is_multi_select: true` where appropriate.

### Banned Shallow Questions

Never ask these — they are inferable or always true:
- ❌ "What tech stack?" → Read package.json
- ❌ "Do you want tests?" → Always yes
- ❌ "What database?" → Check existing config
- ❌ "Should we follow best practices?" → Always yes
- ❌ "What's the project structure?" → Run list_dir

## Execution Steps

1. **Run Pre-Question Research Protocol** (above).
2. **Formulate 3–5 Sharp Questions** using the rules above.
3. **Present Interactively**: Use the `ask_question` tool to present questions with selectable options.
4. **Mandatory Pause**: **STOP IMMEDIATELY.** Do NOT generate specs or write code. Yield control and wait for the user's answers.
