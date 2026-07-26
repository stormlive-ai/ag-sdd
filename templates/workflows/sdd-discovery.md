# @sdd-discovery Workflow — Phase 1 Discovery Gate

Use this workflow to initiate Phase 1 Discovery when starting a feature or project.

## Execution Protocol

1. **Analyze User Request**:
   - Inspect the codebase and `.specs/` directory.

2. **Formulate 3 to 5 Sharp Questions**:
   - Formulate **EXACTLY 3 to 5 sharp, concise architectural questions** covering the most critical ambiguities (Scope, Integration, Core Logic, Error Handling).
   - **DO NOT** output a wall of text or print template boilerplates with dozens of sub-questions.

3. **Present Interactively**:
   - Use the `ask_question` tool (if active) to present the questions with selectable options and write-in fields.
   - If outputting to chat, present **3 to 5 clean, numbered questions** with concise multiple-choice options (e.g., A, B, C).

4. **Mandatory Pause**:
   - **STOP IMMEDIATELY.** Do NOT generate specs or write code. Yield control and wait for the user's answers.
