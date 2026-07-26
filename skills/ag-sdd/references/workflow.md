# ag-sdd Workflow Reference

This document details the 4 mandatory phases of the `ag-sdd` workflow. **No phase may be skipped.**

## Phase 1: Discovery (Clarification Gate)

Before writing any code or generating any specs for a non-trivial prompt:
1. **Check for existing specs**: Run `npx ag-sdd status` and `npx ag-sdd list`.
2. **Mandatory Clarification Gate**: You **MUST** ask 3–5 sharp, architectural questions using `ask_question` UI tool.
3. **Wait**: Yield to the user and wait for their answers before proceeding to Phase 2.

## Phase 2: Spec Generation

After receiving answers, generate the specification artifacts in `.specs/<feature>/`:
- `00_research.md`: Spike options evaluation table.
- `01_requirements.md`: Use EARS syntax (`WHEN`, `WHILE`, `WHERE`, `IF...THEN`, `THE SYSTEM SHALL`).
- `02_design.md`: Include Mermaid architecture diagrams and explicit file boundaries.
- `03_tasks.md`: Create the execution plan using the A-C-E format (up to 50–100+ tasks for complex features).

Run `npx ag-sdd linter <feature>` after generating to verify structural compliance.

## Phase 3: Sequential Execution

Tasks must be executed from `03_tasks.md` one at a time, in dependency order.
1. **Find next task**: Run `npx ag-sdd next`.
2. **Start task**: Run `npx ag-sdd start <feature> <task>`.
3. **Check boundaries**: Only modify files listed in the task's `_Boundary:_`. The runtime boundary guard hook will block unlisted edits.
4. **Execute**: Write the code.
5. **Verify**: Run the command in `_Verification:_`. Do NOT optimistically check off tasks.
6. **Log & Complete**: Run `npx ag-sdd complete <feature> <task> --note "..."`.
7. **Yield**: Pause and wait for user check-in before starting the next task.

## Phase 4: Quality Signoff

When all tasks are complete:
1. Run the full project test suite.
2. Complete `04_signoff.md` documenting results, deviations, and technical debt.
3. Present the signoff document to the user for final approval.
