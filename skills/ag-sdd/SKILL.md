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

This skill governs a strict 4-phase lifecycle. For detailed breakdown, read [Workflow Reference](./references/workflow.md).

1. **Phase 1: Discovery** (`@sdd-discovery` — Mandatory Clarification Gate)
2. **Phase 2: Spec Generation** (`@sdd-spec` — EARS syntax & A-C-E tasks)
3. **Phase 3: Sequential Execution** (`@sdd-impl` — One task per turn, strict boundaries)
4. **Phase 4: Quality Signoff** (`@sdd-signoff` — Full verification)

## Required CLI Commands

You must use the `ag-sdd` CLI to navigate the workflow:

- `npx ag-sdd status`: Shows task progress across all feature specs.
- `npx ag-sdd next`: Identifies the next executable task whose dependencies are fully satisfied.
- `npx ag-sdd start <feature> <task>`: Marks a task in-progress `[/]`.
- `npx ag-sdd complete <feature> <task> --note "..."`: Marks task complete `[x]` and logs structured notes.
- `npx ag-sdd linter <feature>`: Validates spec structure and EARS syntax.

## Subagent Model Tier Selection

When spawning subagents for SDD phases via `invoke_subagent`:
- **`sdd-architect`**: Use `pro` model tier for deep architectural reasoning and 100+ task decomposition.
- **`sdd-executor`**: Use `flash` or `flash_lite` (nano) model tier for fast, low-latency single-task boundary execution.
- **`sdd-reviewer`**: Use `pro` model tier for comprehensive quality audit and git diff review.

## Execution Rules (Phase 3)

When executing tasks from `.specs/<feature>/03_tasks.md`, you must:
1. **Never batch tasks.** Execute exactly one task per turn.
2. **Respect boundaries.** Never modify files outside the declared `_Boundary:_`. The runtime boundary guard hook (`hooks/boundary-guard.mjs`) will block unlisted edits.
3. **Verify.** Never mark a task `[x]` without running the `_Verification:_` command.
4. **Propagate context.** Append learnings via `ag-sdd complete` after every task.
