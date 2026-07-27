This document details the 4 mandatory phases of the `ag-sdd` workflow. **No phase may be skipped.**

## Phase 1: Discovery (Clarification Gate)

Before writing any code or generating any specs for a non-trivial prompt:

1. **Check for existing specs**: Run `npx ag-sdd status` and `npx ag-sdd list`.
2. **Research the codebase** (MANDATORY before asking questions):
   - Run `list_dir` on project root — catalog modules and directories.
   - Read `package.json` — identify stack, scripts, dependencies.
   - Use `grep_search` for existing patterns related to the user's request.
   - Read 3–5 relevant source files to understand existing architecture.
   - Check `.specs/.steering/` for prior decisions — avoid re-asking settled questions.
3. **Research externally**: Use `search_web` to research relevant libraries, APIs, and best practices.
4. **Mandatory Clarification Gate**: Ask 3–5 sharp, architectural questions using the `ask_question` UI tool. Each question must reference specific findings from your research.
5. **Wait**: Yield to the user and wait for their answers before proceeding to Phase 2.

## Phase 2: Spec Generation

After receiving answers, generate the specification artifacts in `.specs/<feature>/`:

- `00_research.md`: Use `search_web` to research prior art. Document problem statement, options comparison matrix.
- `01_requirements.md`: Use EARS syntax (`WHEN`, `WHILE`, `WHERE`, `IF...THEN`, `THE SYSTEM SHALL`).
- `02_design.md`: Include Mermaid architecture diagrams and explicit file boundaries. For UI features, use `generate_image` to create mockups.
- `03_tasks.md`: Create the execution plan using the A-C-E format (up to 50–100+ tasks for complex features).

Update `.specs/.steering/decisions.md` with key decisions from this feature.

Run `npx ag-sdd linter <feature>` after generating to verify structural compliance.

## Phase 3: Sequential Execution

Tasks must be executed from `03_tasks.md` one at a time, in dependency order.

1. **Find next task**: Run `npx ag-sdd next`.
2. **Start task**: Run `npx ag-sdd start <feature> <task>`.
3. **Check boundaries**: Only modify files listed in the task's `_Boundary:_`. The runtime boundary guard hook will block unlisted edits.
4. **Execute**: Write the code. For UI tasks, use `generate_image` to create visual assets instead of placeholders.
5. **Verify**: Run the command in `_Verification:_`. If the command takes >30 seconds, use the `schedule` tool to set a check-in timer. Do NOT optimistically check off tasks.
6. **Log & Complete**: Run `npx ag-sdd complete <feature> <task> --note "..."`.
7. **Yield**: Pause and wait for user check-in before starting the next task.

### Parallel Execution (Advanced)

For independent tasks with no shared dependencies, multiple `sdd-executor` subagents can run in parallel:
- Use `invoke_subagent` to launch concurrent executors on non-overlapping boundary tasks.
- Only tasks where `_Depends:_` are ALL satisfied and `_Boundary:_` files do not overlap are eligible.

## Phase 4: Quality Signoff

When all tasks are complete:

1. Run the full project test suite.
2. Audit `git diff` against `02_design.md` — flag unexpected file changes.
3. Complete `04_signoff.md` documenting results, deviations, and technical debt.
4. Present the signoff document to the user for final approval.
