# @sdd-impl Workflow — Phase 3 Sequential Execution Loop

Use this workflow to execute tasks from `.specs/<feature-name>/03_tasks.md` sequentially.

## Execution Protocol

1. **Identify Next Task**:
   - Run `npx ag-sdd next` to discover the next executable task whose dependencies are satisfied.
   - Run `npx ag-sdd start <feature-name> <task-number>` to mark the task `[/]` in-progress.

2. **Inspect Boundary**:
   - Read `_Boundary:_` declared in the task.
   - The runtime boundary guard hook (`hooks/boundary-guard.mjs`) will block modifications to any unlisted file!

3. **Execute Task**:
   - Implement code changes strictly within declared boundary files.

4. **Empirical Verification**:
   - Run the exact command listed under `_Verification:_`.
   - Output must demonstrate clean success.

5. **Log Notes & Complete**:
   - Run `npx ag-sdd complete <feature-name> <task-number> --note "Key decisions, gotchas, discovered interfaces"` to mark `[x]` complete and append structured notes.

6. **Yield**:
   - Pause execution and yield control to the user before starting the next task.
