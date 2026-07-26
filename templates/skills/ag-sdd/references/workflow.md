# ag-sdd Workflow Reference

This document details the 4 mandatory phases of the `ag-sdd` workflow. **No phase may be skipped.**

## Phase 1: Discovery (Clarification Gate)

Before writing any code or generating any specs for a non-trivial prompt:
1. **Check for existing specs**: Run `npx ag-sdd status` and `npx ag-sdd list`.
2. **Mandatory Clarification Gate**: You **MUST** ask 3–5 sharp, architectural questions covering:
   - Scope boundaries (what is in/out of scope)
   - Integration points
   - Acceptance criteria
   - Edge cases & errors
   - Performance constraints
3. **Wait**: Yield to the user and wait for their answers before proceeding to Phase 2.

## Phase 2: Spec Generation

After receiving answers, generate the specification artifacts in `.specs/<feature>/`:
- `01_requirements.md`: Use EARS syntax (`WHEN`, `WHILE`, `WHERE`, `IF...THEN`, `THE SYSTEM SHALL`).
- `02_design.md`: Include Mermaid architecture diagrams and explicit file boundaries.
- `03_tasks.md`: Create the execution plan using the A-C-E format.

**Granularity Minimums**:
- Small Fix: 5-10 tasks
- Medium Feature: 15-25 tasks
- Large Feature: 30-50+ tasks

Run `npx ag-sdd verify` after generating to ensure structural compliance.

## Phase 3: Sequential Execution

Tasks must be executed from `03_tasks.md` one at a time, in dependency order.
1. **Find next task**: Run `npx ag-sdd next`.
2. **Check boundaries**: Only modify files listed in the task's `_Boundary:_`.
3. **Execute**: Write the code.
4. **Verify**: Run the command in `_Verification:_`. Do NOT optimistically check off tasks.
5. **Propagate Notes**: Append decisions, gotchas, and contracts to `## Implementation Notes`.
6. **Mark Complete**: Change `[ ]` to `[x]` in the task list.
7. **Yield**: Pause and wait for user check-in before starting the next task.

## Phase 4: Quality Signoff

When all tasks are complete:
1. Run the full project test suite.
2. Complete the `04_signoff.md` template documenting the results, any deviations from the design, and known technical debt.
3. Present the signoff document to the user for final approval.
