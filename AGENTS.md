# AGENTS.md — Anti-Gravity Spec-Driven Development (ag-sdd)

> **This file is the primary steering entry point for any Anti-Gravity agent operating within a repository that uses the `ag-sdd` workflow.**
> Every instruction below is **non-negotiable**. Violations constitute a failed task.

---

## 1. Purpose & Philosophy

`ag-sdd` enforces a **Spec-Driven Development** methodology where every non-trivial code change is governed by a structured specification pipeline. The core guarantee:

> **No code is written until a specification exists, has been decomposed into atomic tasks, and the agent has passed a clarification gate.**

This eliminates the two most common failure modes of agentic coding:
1. **Thin Thinking** — collapsing complex work into a handful of vague tasks.
2. **Boundary Violations** — modifying files outside the declared scope of a task.

---

## 2. SDD Workflow Lifecycle

Every non-trivial prompt passes through exactly four phases. **No phase may be skipped.**

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SDD WORKFLOW LIFECYCLE                          │
│                                                                     │
│   ┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────┐ │
│   │ DISCOVERY│───▶│ SPEC GEN │───▶│  SEQUENTIAL  │───▶│ QUALITY  │ │
│   │          │    │          │    │  EXECUTION   │    │ SIGNOFF  │ │
│   └──────────┘    └──────────┘    └──────────────┘    └──────────┘ │
│                                                                     │
│   Phase 1:        Phase 2:        Phase 3:            Phase 4:      │
│   Clarification   Generate spec   Execute tasks       Run full      │
│   Gate (3-5 Qs)   artifacts in    ONE per context     verification  │
│                   .specs/         pass, verify,       suite, update │
│                                   propagate notes     signoff log   │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 1 — Discovery (Mandatory Clarification Gate)

When a non-trivial prompt is received:

1. **Check for existing specs.** Look for a `.specs/` directory at the repository root. If specs already exist for this feature, resume from the current task state.
2. **If no specs exist**, do **NOT** begin generating code or specs immediately.
3. **Ask 3–5 sharp, architectural clarification questions** covering:
   - Scope boundaries (what is explicitly in/out of scope?)
   - Integration points (what existing systems/APIs/modules are involved?)
   - Acceptance criteria (how will "done" be measured empirically?)
   - Edge cases and error handling expectations
   - Performance/scalability constraints (if applicable)
4. **Wait for the user to respond** before proceeding to Phase 2.

> **Hard Rule:** An agent that skips the clarification gate and begins writing specs or code has failed the task. No exceptions.

### Phase 2 — Spec Generation

After clarification answers are received, generate the spec artifact suite inside `.specs/`:

| File | Purpose |
|---|---|
| `.specs/01_requirements.md` | Structured requirements derived from the user's clarified intent. Functional requirements, non-functional requirements, constraints. |
| `.specs/02_design.md` | Technical design: architecture decisions, data models, API contracts, module boundaries, sequence diagrams (Mermaid). |
| `.specs/03_tasks.md` | Ordered task list with **A-C-E** (Action-Context-Execution) format. Each task includes `_Boundary:_` and `_Depends:_` metadata. |

#### Task Count Minimums (Granularity Floor)

| Scope | Minimum Tasks | Examples |
|---|---|---|
| Bug fix / small tweak | 5–10 | Fix off-by-one, add validation, patch CSS |
| Medium feature | 15–25 | New API endpoint, dashboard component, auth flow |
| Full application / major refactor | 30–50+ | Greenfield app, architecture migration, platform rewrite |

> **Hard Rule:** A spec with fewer tasks than the minimum for its scope category will be **rejected**. Decompose further.

### Phase 3 — Sequential Execution

Tasks from `03_tasks.md` are executed **one at a time, in dependency order**.

For each task:

1. **Read the task's `_Boundary:_` declaration.** Only the listed file paths may be created, modified, or deleted.
2. **Read the task's `_Depends:_` declaration.** All prerequisite tasks must have a `[x]` checkmark before this task begins.
3. **Execute the task.** Write code, create files, modify configurations — but **only** within the declared boundary.
4. **Run verification.** Execute the CLI verification command(s) specified in the task or in the project's test suite. At minimum:
   - Lint/format check
   - Type check (if applicable)
   - Unit tests covering the changed boundary
   - Build step (if applicable)
5. **Record learnings.** Append findings, gotchas, and integration notes to the `## Implementation Notes` section at the bottom of `03_tasks.md`.
6. **Mark the task complete.** Change `- [ ] Task N` to `- [x] Task N` in `03_tasks.md` **only after empirical verification passes**.
7. **Pause.** Yield control to the user for check-in before proceeding to the next task.

> **Hard Rule:** An agent must **never** mark a task `[x]` without running and passing verification. Optimistic checkmarks are a violation.

### Phase 4 — Quality Signoff

After all tasks in `03_tasks.md` are marked `[x]`:

1. Run the **full project verification suite** (all tests, lint, build, type-check).
2. Generate a `.specs/04_signoff.md` containing:
   - Summary of all tasks completed
   - Verification results (pass/fail for each check)
   - Any deviations from the original spec and rationale
   - Remaining technical debt or follow-up items
3. Present the signoff to the user for final approval.

---

## 3. Operational Constraints (Non-Negotiable)

These constraints apply at **all times** during any phase of the SDD lifecycle.

### 3.1 — Boundary Isolation

```
NEVER modify, create, or delete a file that is not explicitly listed
in the current task's _Boundary:_ declaration.
```

- If a task requires touching an unlisted file, **stop and update the spec first**.
- Cross-boundary side effects (e.g., importing a module that triggers changes in another module's barrel export) must be declared explicitly.
- The `.specs/` directory itself is always within boundary for metadata updates (checkmarks, implementation notes).

### 3.2 — Dependency Ordering

```
NEVER begin a task whose _Depends:_ prerequisites are not ALL marked [x].
```

- If a dependency is blocked, surface the blocker to the user instead of skipping ahead.
- Circular dependencies in the task graph indicate a spec defect. Stop and restructure.

### 3.3 — Verification Before Checkmark

```
NEVER mark a task [x] without running and passing at least one
empirical verification command (test, lint, build, type-check).
```

- "It looks correct" is not verification. Commands must be executed and output must confirm success.
- If verification fails, fix the issue within the task's boundary before marking complete.

### 3.4 — Context Propagation

```
ALWAYS append learnings to ## Implementation Notes in 03_tasks.md
after completing each task.
```

- Notes must include: decisions made, gotchas encountered, interface contracts discovered, and any deviations from the design doc.
- These notes serve as persistent context for subsequent tasks and future agents.

### 3.5 — Single Task Per Context Pass

```
EXECUTE exactly ONE task per agent turn. Do not batch multiple tasks.
```

- After completing one task and recording notes, yield to the user.
- This ensures human oversight at every decision point and prevents cascading errors.

### 3.6 — No Guessing

```
If requirements are ambiguous, STOP and ASK. Never infer intent.
```

- This applies during all phases, not just Phase 1.
- If mid-execution a design question arises that the spec doesn't cover, pause and ask the user rather than making an assumption.

---

## 4. Spec Directory Structure

When `ag-sdd` is active, the following directory structure is expected:

```
<repo-root>/
├── .specs/
│   ├── 01_requirements.md      # Clarified requirements
│   ├── 02_design.md            # Technical design & architecture
│   ├── 03_tasks.md             # Ordered A-C-E task list
│   ├── 04_signoff.md           # Quality signoff (generated at end)
│   └── notes/                  # Optional: supplementary research, diagrams
├── AGENTS.md                   # This file (steering entry point)
├── rules/
│   └── ag-sdd-rules.md         # Core enforcement rules
└── ...                         # Project source code
```

---

## 5. A-C-E Task Format Reference

Every task in `03_tasks.md` MUST follow this format:

```markdown
- [ ] **Task N: <Concise Title>**
  - _Action:_ What specific code change or artifact to produce.
  - _Context:_ Why this task exists, what architectural role it plays, and what constraints apply.
  - _Execution:_ Step-by-step implementation instructions with enough detail that a stateless agent can complete the task without guessing.
  - _Boundary:_ `path/to/file1.ts`, `path/to/file2.ts` (exhaustive list of files this task may touch)
  - _Depends:_ `Task 1`, `Task 3` (or `None` if no dependencies)
  - _Verification:_ `npm test -- --grep "feature-name"` (exact CLI command to verify)
```

---

## 6. Agent Activation Protocol

When an Anti-Gravity agent receives a prompt in a repository containing this `AGENTS.md`:

```
1. READ this file in full.
2. CHECK if .specs/ directory exists.
   ├── YES → Read 03_tasks.md, find the next unchecked task, resume Phase 3.
   └── NO  → Enter Phase 1 (Clarification Gate).
3. FOLLOW the lifecycle. No shortcuts.
```

---

## 7. CLI Commands Reference

The `ag-sdd` CLI provides workflow management commands:

| Command | Purpose |
|---|---|
| `ag-sdd init` | Initialize `.specs/` directory with template files |
| `ag-sdd verify` | Run all verification checks for the current project |
| `ag-sdd status` | Display current task progress from `03_tasks.md` |
| `ag-sdd validate-spec` | Check spec files for structural compliance |
| `ag-sdd next` | Show the next executable task (respecting dependencies) |
| `ag-sdd notes` | Display accumulated `## Implementation Notes` |

---

## 8. Error Recovery

| Situation | Protocol |
|---|---|
| Verification fails for a task | Fix within boundary. If unfixable within boundary, update spec and request user approval. |
| Task requires out-of-boundary file | Stop. Propose a spec amendment. Do not touch the file. |
| Circular dependency detected | Stop. Restructure the task graph. Request user review. |
| Ambiguous requirement mid-execution | Stop. Ask the user. Do not guess. |
| Agent context window approaching limit | Save all progress to `## Implementation Notes`, mark current task as `[/]` (in-progress), and yield. |

---

> **Remember:** The goal of ag-sdd is not to slow development down — it is to eliminate rework, prevent scope creep, and ensure that every line of code traces back to a verified requirement. Speed comes from never having to redo work.
