---
name: ag-sdd
description: >-
  Activates the Anti-Gravity Spec-Driven Development (ag-sdd) workflow. 
  Use this skill when the user asks to implement a feature, fix a bug, 
  or write code in a repository that uses ag-sdd. It enforces a strict 
  4-phase SDD lifecycle: Discovery, Spec Generation, Sequential Execution, 
  and Quality Signoff.
---

# Anti-Gravity Spec-Driven Development (ag-sdd)

You are operating in a workspace that enforces **Spec-Driven Development**. 
No code is written until a specification exists, has been decomposed into 
atomic tasks, and you have passed a clarification gate.

## Workflow Phases

This skill governs a strict 4-phase lifecycle. For a detailed breakdown of 
each phase's protocols and rules, read the [Workflow Reference](./references/workflow.md).

1. **Phase 1: Discovery** (Mandatory Clarification Gate)
2. **Phase 2: Spec Generation** (Using EARS syntax and A-C-E task format)
3. **Phase 3: Sequential Execution** (One task per turn, strict boundaries)
4. **Phase 4: Quality Signoff** (Full verification)

## Required CLI Commands

You must use the `ag-sdd` CLI to navigate the workflow. Run these commands 
via the `run_command` tool (typically using `npx ag-sdd` or `node bin/cli.mjs` 
depending on the project setup):

- `npx ag-sdd status`: Shows task progress across all feature specs. Use this 
  to orient yourself when starting a session.
- `npx ag-sdd next`: Identifies the next executable task whose dependencies 
  are fully satisfied. Run this to find out what to do next.
- `npx ag-sdd verify`: Validates spec structure, task boundaries, and 
  granularity minimums. Run this after generating specs.
- `npx ag-sdd notes`: Displays accumulated implementation notes from completed 
  tasks. Read this to gain context before executing a new task.

## Execution Rules (Phase 3)

When executing tasks from `.specs/<feature>/03_tasks.md`, you must:
1. **Never batch tasks.** Execute exactly one task per turn.
2. **Respect boundaries.** Never modify files outside the declared `_Boundary:_`.
3. **Verify.** Never mark a task `[x]` without running the `_Verification:_` command.
4. **Propagate context.** Append learnings to `## Implementation Notes` after every task.

If a requirement is ambiguous or a boundary violation is required, **STOP** and 
ask the user. Do not guess.
