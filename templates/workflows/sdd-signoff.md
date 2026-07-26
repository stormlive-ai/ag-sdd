# @sdd-signoff Workflow — Phase 4 Quality Signoff

Use this workflow when all tasks in `.specs/<feature-name>/03_tasks.md` are marked `[x]`.

## Execution Protocol

1. **Verify Completion**:
   - Run `npx ag-sdd status` to ensure 100% task completion.

2. **Run Full Verification Suite**:
   - Execute all project build, lint, typecheck, and test commands.

3. **Audit Specs & Log Signoff**:
   - Populate `.specs/<feature-name>/04_signoff.md` with test result matrix, deviations log, and remaining technical debt.
   - Present final signoff report to the user for approval.
