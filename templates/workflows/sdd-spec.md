# @sdd-spec Workflow — Phase 2 Spec Generation

Use this workflow to generate the full specification suite inside `.specs/<feature-name>/` after the clarification gate is passed.

## Execution Steps

1. **Invoke Architect Subagent**:
   - Spawn the `sdd-architect` subagent (or adopt its persona) with the user's clarification answers.

2. **Generate Spec Artifacts**:
   Create the directory `.specs/<feature-name>/` and populate all 4 spec documents:
   - `00_research.md`: Document problem statement, prior art, options comparison matrix.
   - `01_requirements.md`: Use formal EARS syntax (`WHEN`, `WHILE`, `WHERE`, `IF...THEN`, `THE SYSTEM SHALL`).
   - `02_design.md`: Include Mermaid architecture diagram, ERD diagram, sequence diagram, and file structure plan.
   - `03_tasks.md`: Create an uncapped, high-granularity task plan in A-C-E format.
     - Small Fix: 5-15 tasks
     - Medium Feature: 20-45 tasks
     - Large Feature / Greenfield App: 50-100+ tasks!
     - Group tasks by Wave: `Wave P0 Foundation` → `Wave P1 Data Models` → `Wave P2 Repositories` → `Wave P3 Business Logic` → `Wave P4 APIs` → `Wave P5 Testing`.

3. **Validate Quality**:
   - Run `npx ag-sdd linter <feature-name>` to verify EARS syntax and A-C-E metadata completeness.
   - Present the spec summary to the user for review.
