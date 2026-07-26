# ag-sdd Enforcement Rules

> **Authority:** These rules are **non-negotiable**. Any agent operating under the `ag-sdd` workflow MUST comply with every rule defined in this document. A violation of any rule constitutes a **task failure** — the agent must stop, acknowledge the violation, remediate, and request user re-approval before continuing.

---

## Rule 1: Mandatory Clarification Gate

### Statement

> Before generating any specification artifacts or writing any code for a non-trivial prompt, the agent **MUST** ask **3–5 sharp, architectural clarification questions** and wait for the user's response.

### Rationale

The single largest source of wasted agentic compute is acting on ambiguous requirements. A 2-minute clarification exchange prevents hours of rework. The clarification gate forces the agent to demonstrate understanding *before* being granted permission to plan.

### Requirements

1. **Minimum 3, maximum 5 questions.** Fewer than 3 indicates insufficient diligence. More than 5 indicates the prompt itself needs restructuring — ask the user to refine the prompt instead.

2. **Questions must be architectural, not cosmetic.** Valid question categories:

   | Category | Example |
   |---|---|
   | **Scope Boundaries** | "Should this feature handle both authenticated and unauthenticated users, or only authenticated?" |
   | **Integration Points** | "Which existing service handles payment processing — should we integrate with it or build a new module?" |
   | **Acceptance Criteria** | "What constitutes a successful migration — zero downtime, or is a maintenance window acceptable?" |
   | **Edge Cases** | "How should the system behave when the upstream API returns a 429? Retry with backoff, queue, or fail fast?" |
   | **Performance / Scale** | "What's the expected request volume — tens per minute or thousands per second?" |

3. **Invalid questions** (will be rejected):
   - "What color should the button be?" (cosmetic — decide based on design system)
   - "Should I use TypeScript?" (tooling — infer from existing project config)
   - "Is this a good idea?" (meta — not the agent's decision)

4. **The agent MUST NOT proceed to Phase 2 (Spec Generation) until answers are received.** If the user says "just go" or "figure it out," the agent should explain that the clarification gate is mandatory and re-ask the most critical questions.

### Violation Conditions

- ❌ Agent begins generating `.specs/01_requirements.md` before asking clarification questions.
- ❌ Agent asks fewer than 3 questions.
- ❌ Agent asks only cosmetic or trivial questions.
- ❌ Agent proceeds without waiting for answers.

### Exemptions

- **Trivial prompts** (typo fix, rename variable, update version number) are exempt. A prompt is trivial if the resulting task list would have ≤3 tasks.
- **Resuming existing specs.** If `.specs/03_tasks.md` already exists and has uncompleted tasks, skip directly to Phase 3 execution.

---

## Rule 2: Granularity Floor (Zero Thin Thinking)

### Statement

> Every task list in `.specs/03_tasks.md` MUST meet or exceed the minimum task count for its scope category. Tasks must be **atomic** — each task produces exactly one verifiable outcome.

### Scope Categories & Minimums

| Scope Category | Minimum Tasks | Maximum Tasks (Guideline) | Characteristics |
|---|---|---|---|
| **Small Fix** | 5–10 | 15 | Bug fix, validation patch, CSS adjustment, config change, small refactor |
| **Medium Feature** | 15–25 | 35 | New API endpoint, UI component suite, auth flow, integration module, data pipeline stage |
| **Large Feature / Full App** | 30–50+ | No upper limit | Greenfield application, architecture migration, platform rewrite, multi-service feature |

### What Makes a Task "Atomic"

A task is atomic if and only if:

1. **Single Responsibility.** It does exactly one thing. "Create the user model and set up authentication" is **two tasks**, not one.
2. **Independently Verifiable.** There exists a CLI command that can confirm the task is complete without relying on future tasks.
3. **Bounded.** The `_Boundary:_` declaration contains ≤5 file paths. If more files are needed, the task should be split.
4. **Completable in One Pass.** A stateless agent with only the spec and implementation notes can complete the task without needing to ask questions (assuming the clarification gate was passed).

### Task Decomposition Heuristics

When decomposing work, use these heuristics to avoid thin thinking:

```
For each module/component, consider:
  ├── Type definitions / interfaces           → 1 task
  ├── Core implementation                      → 1-3 tasks (split by method/function)
  ├── Error handling & edge cases              → 1 task
  ├── Unit tests                               → 1 task per test suite
  ├── Integration with adjacent modules        → 1 task per integration point
  ├── Configuration / environment setup        → 1 task
  └── Documentation / JSDoc / comments         → 1 task (if non-trivial)
```

### Violation Conditions

- ❌ A "Medium Feature" spec contains only 8 tasks.
- ❌ A task's _Action_ describes two or more distinct implementation steps.
- ❌ A task's _Boundary_ lists more than 5 files (indicates task should be split).
- ❌ A task has no _Verification_ command (unverifiable tasks are not atomic).

### Remediation

If a spec is found to violate the granularity floor:

1. **Do not begin execution.** Return to Phase 2.
2. Identify under-decomposed tasks.
3. Split each into 2–4 atomic subtasks.
4. Re-validate against the minimum count.
5. Present the revised spec to the user before proceeding.

---

## Rule 3: Contract Enforcement (Boundary Isolation)

### Statement

> Every task in `.specs/03_tasks.md` MUST declare explicit `_Boundary:_` and `_Depends:_` metadata. The agent MUST NOT modify any file outside the declared boundary, and MUST NOT begin a task whose dependencies are incomplete.

### Boundary Declaration Format

```markdown
_Boundary:_ `src/models/user.ts`, `src/models/user.test.ts`, `src/types/user.d.ts`
```

- **Exhaustive.** Every file that will be created, modified, or deleted must be listed.
- **Exact paths.** Glob patterns are NOT permitted. Use explicit file paths relative to the repository root.
- **Maximum 5 files per task.** If more are needed, split the task (see Rule 2).
- **`.specs/` is always implicitly in-boundary** for metadata updates (checkmarks, implementation notes).

### Dependency Declaration Format

```markdown
_Depends:_ `Task 1`, `Task 4`, `Task 7`
```

or

```markdown
_Depends:_ `None`
```

- **Explicit.** Every prerequisite must be named by its task identifier.
- **Acyclic.** The dependency graph must be a DAG (Directed Acyclic Graph). Circular dependencies indicate a spec defect.
- **Verified.** Before starting a task, the agent must confirm that all dependencies have `[x]` checkmarks in `03_tasks.md`.

### Runtime Enforcement Protocol

During task execution, the agent must maintain a **boundary checklist**:

```
Before writing to any file:
  1. Is this file listed in the current task's _Boundary:_?
     ├── YES → Proceed.
     └── NO  → STOP. Do not write. Log the violation attempt.
                Determine if:
                ├── The file should be added to _Boundary:_ (spec amendment)
                └── The work belongs in a different task
                In either case, pause and request user approval.
```

### Cross-Boundary Side Effects

Some changes have implicit side effects on files outside the boundary:

| Change | Side Effect | Required Action |
|---|---|---|
| Adding an export to a module | Barrel file (`index.ts`) may need updating | Include barrel file in `_Boundary:_` |
| Adding a database migration | ORM schema/snapshot may auto-update | Include generated files in `_Boundary:_` |
| Modifying a shared type | Downstream consumers may break | Add type-check verification, note in `_Depends:_` for downstream tasks |
| Adding a dependency | `package.json` and lockfile change | Include both in `_Boundary:_` |

### Violation Conditions

- ❌ Agent modifies a file not listed in `_Boundary:_`.
- ❌ Agent begins a task when a dependency is not marked `[x]`.
- ❌ Task declaration is missing `_Boundary:_` or `_Depends:_` metadata.
- ❌ `_Boundary:_` uses glob patterns instead of explicit paths.
- ❌ Agent does not check dependency status before starting a task.

### Remediation for Boundary Violations

1. **Immediately revert** the out-of-boundary change.
2. Log the violation in `## Implementation Notes`.
3. Propose a spec amendment that either:
   - Adds the file to the current task's boundary (if small scope), or
   - Creates a new task for the out-of-boundary work.
4. Wait for user approval before continuing.

---

## Rule 4: Single Task Context Pass

### Statement

> The agent MUST execute exactly **one task per context pass** (per agent turn). After completing a task, the agent MUST run verification, write implementation notes, update the checkmark, and **pause for user check-in**.

### Rationale

Single-task execution provides three guarantees:

1. **Error Containment.** A mistake in Task 5 does not silently cascade into Tasks 6–10.
2. **Human Oversight.** The user can course-correct at every decision point.
3. **Context Freshness.** Each task starts with clean context plus accumulated implementation notes, avoiding context window degradation.

### Execution Protocol (Per Task)

```
┌─────────────────────────────────────────────────────────────┐
│                SINGLE TASK EXECUTION PROTOCOL                │
│                                                              │
│  1. READ task from 03_tasks.md                              │
│     ├── Verify all _Depends:_ are [x]                       │
│     └── Parse _Boundary:_ file list                         │
│                                                              │
│  2. EXECUTE the task                                         │
│     ├── Follow _Execution:_ steps                           │
│     ├── Write code ONLY within _Boundary:_ files            │
│     └── If blocked or ambiguous → STOP and ask user         │
│                                                              │
│  3. VERIFY empirically                                       │
│     ├── Run the _Verification:_ command(s)                  │
│     ├── Confirm output shows success                         │
│     └── If failure → fix within boundary, re-verify         │
│                                                              │
│  4. RECORD implementation notes                              │
│     ├── What was decided and why                            │
│     ├── Gotchas or surprises encountered                    │
│     ├── Interface contracts discovered                      │
│     └── Any deviations from the design doc                  │
│                                                              │
│  5. UPDATE checkmark                                         │
│     └── Change - [ ] Task N  →  - [x] Task N               │
│         (ONLY after verification passes)                     │
│                                                              │
│  6. PAUSE                                                    │
│     └── Yield control to user for check-in                  │
│         "Task N complete. Ready for Task N+1?"              │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Notes Format

Append the following block to `## Implementation Notes` in `03_tasks.md` after each task:

```markdown
### Task N: <Title> — Notes
- **Completed:** <timestamp>
- **Decisions:** <key decisions made during implementation>
- **Gotchas:** <unexpected issues encountered>
- **Contracts:** <interface contracts discovered or established>
- **Deviations:** <any deviations from 02_design.md and why>
- **Next Task Context:** <anything the next task's agent needs to know>
```

### Violation Conditions

- ❌ Agent executes more than one task in a single turn without user check-in.
- ❌ Agent marks a task `[x]` without running a verification command.
- ❌ Agent does not append to `## Implementation Notes` after completing a task.
- ❌ Agent does not pause for user check-in between tasks.
- ❌ Agent marks a task `[x]` when verification output shows failures.

### Exemptions

- **Trivial sequential tasks with no decision points** (e.g., Task 3 is "create empty test file" and Task 4 is "add first test case") may be batched **only with explicit user pre-approval** ("go ahead and do Tasks 3–4 together").
- The user may grant a **batch execution window** (e.g., "execute Tasks 5–10 without pausing") but the agent must still verify each task individually and record notes for each.

---

## Summary of All Rules

| # | Rule | Key Constraint | Minimum Bar |
|---|---|---|---|
| 1 | Mandatory Clarification Gate | Ask before you build | 3–5 architectural questions |
| 2 | Granularity Floor | No thin thinking | 5–50+ tasks depending on scope |
| 3 | Contract Enforcement | Boundary isolation | Explicit `_Boundary:_` and `_Depends:_` per task |
| 4 | Single Task Context Pass | One task, one turn | Verify → Notes → Checkmark → Pause |

---

## Enforcement Hierarchy

```
AGENTS.md (workflow lifecycle)
    │
    └── rules/ag-sdd-rules.md (this file — enforcement details)
            │
            ├── Rule 1: Gate before you plan
            ├── Rule 2: Plan with sufficient granularity
            ├── Rule 3: Execute within declared boundaries
            └── Rule 4: Execute one task at a time, verify, propagate
```

> **When in doubt, stop and ask.** The cost of a clarification question is near-zero. The cost of rework after an incorrect assumption scales with every subsequent task that builds on the wrong foundation.
