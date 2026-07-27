Use this workflow to generate the full specification suite inside `.specs/<feature-name>/` after the clarification gate is passed.

## Execution Steps

1. **Create Feature Directory**:
   - Run `npx ag-sdd new <feature-name>` to scaffold the spec directory.

2. **Generate Research Document** (`00_research.md`):
   - Use `search_web` to research relevant libraries, APIs, and best practices.
   - Document problem statement, prior art, options comparison matrix.

3. **Generate Requirements** (`01_requirements.md`):
   - Use formal EARS syntax: `WHEN`, `WHILE`, `WHERE`, `IF...THEN`, `THE SYSTEM SHALL`.
   - Every requirement must be testable and traceable to a task.

4. **Generate Design** (`02_design.md`):
   - Include Mermaid architecture diagram, ERD diagram, sequence diagram, and file structure plan.
   - For UI features, use `generate_image` to create mockups and wireframes.
   - Define explicit file boundaries for each module.

5. **Generate Task Plan** (`03_tasks.md`):
   - Create an uncapped, high-granularity task plan in A-C-E format.
   - Granularity floors:
     - Small Fix: 5–15 tasks
     - Medium Feature: 20–45 tasks
     - Large Feature / Greenfield App: 50–100+ tasks
   - Group tasks by Wave: `Wave P0 Foundation` → `Wave P1 Data Models` → `Wave P2 Repositories` → `Wave P3 Business Logic` → `Wave P4 APIs` → `Wave P5 Testing`.

6. **Update Steering Files**:
   - Append key architectural decisions to `.specs/.steering/decisions.md`.
   - Update `.specs/.steering/stack.md` if new technologies are introduced.

7. **Validate Quality**:
   - Run `npx ag-sdd linter <feature-name>` to verify EARS syntax and A-C-E metadata completeness.
   - Present the spec summary to the user for review.
