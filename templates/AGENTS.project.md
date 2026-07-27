# AGENTS.md — Project Configuration
> This project uses **ag-sdd** (Spec-Driven Development) for all non-trivial code changes.

---

## Quick Start

```bash
# Show current task progress
npx ag-sdd status

# Create a new feature spec
npx ag-sdd new <feature-name>

# Find the next executable task
npx ag-sdd next

# Start working on a task
npx ag-sdd start <feature> <task>

# Complete a task with notes
npx ag-sdd complete <feature> <task> --note "..."
```

## SDD Workflow

Every non-trivial change follows a 4-phase lifecycle:

1. **Discovery** — Ask 3–5 clarification questions before writing any code.
2. **Spec Generation** — Create requirements, design, and task plan in `.specs/<feature>/`.
3. **Sequential Execution** — Execute tasks one at a time within declared boundaries.
4. **Quality Signoff** — Run full verification and generate signoff document.

> For detailed workflow rules, see the `@ag-sdd` skill.

## Project Stack

<!-- Update these to reflect your project -->

- **Language**: 
- **Framework**: 
- **Test Runner**: 
- **Linter**: 
- **Build Tool**: 

## Project Commands

<!-- Update these to reflect your project -->

| Command | Purpose |
|---|---|
| `npm run build` | Build the project |
| `npm test` | Run tests |
| `npm run lint` | Run linter |

## Conventions

- Follow existing code style and naming patterns.
- All new code must have corresponding tests.
- Use meaningful commit messages.

## Spec Directory Structure

```
.specs/
├── .steering/          # Persistent project context
│   ├── stack.md        # Technology stack decisions
│   ├── conventions.md  # Coding conventions
│   └── decisions.md    # Architectural decision log
├── <feature-name>/     # Per-feature spec directory
│   ├── 00_research.md
│   ├── 01_requirements.md
│   ├── 02_design.md
│   ├── 03_tasks.md
│   └── 04_signoff.md
```
