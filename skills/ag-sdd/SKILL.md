---
name: ag-sdd
description: >-
  Activates the Anti-Gravity Spec-Driven Development (ag-sdd) workflow. 
  Use this skill when the user asks to implement a feature, fix a bug, 
  or write code in a repository that uses ag-sdd. It enforces a strict 
  4-phase SDD lifecycle: Discovery, Spec Generation, Sequential Execution, 
  and Quality Signoff.
---
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
- `npx ag-sdd active`: Shows currently in-progress tasks and their boundaries.

## Subagent Model Tier Selection

When spawning subagents for SDD phases via `invoke_subagent`:
- **`sdd-architect`**: Use `inherit` (Gemini Flash is sufficient for question formulation and spec generation).
- **`sdd-executor`**: Use `inherit` (Flash excels at bounded single-task execution).
- **`sdd-reviewer`**: Use `inherit` (Flash can run verification commands and audit diffs).

Escalate to `pro` only when:
- Feature complexity exceeds 50+ tasks (architect needs deeper reasoning)
- Cross-module architectural reviews (reviewer needs wider context)

## Antigravity Tool Integration

Leverage the full Antigravity tool suite during SDD phases:
- **`generate_image`**: Create UI mockups during Phase 2, generate visual assets during Phase 3.
- **`search_web`**: Research libraries, APIs, and best practices during Phase 1 and Phase 2.
- **`define_subagent`**: For complex features (50+ tasks), create specialized subagents with narrow scope.
- **`schedule`**: Set check-in timers for long-running verification commands during Phase 3.
- **`ask_question`**: Present discovery questions with selectable options during Phase 1.

## Context Hygiene Protocol

To prevent context window degradation during long task sequences:
- Before each task, read ONLY: the task's A-C-E metadata, previous 2–3 implementation notes, and relevant design sections.
- Do NOT re-read the full requirements or complete task list each turn.
- Use `npx ag-sdd notes` to efficiently retrieve accumulated context.

## Execution Rules (Phase 3)

When executing tasks from `.specs/<feature>/03_tasks.md`, you must:
1. **Never batch tasks.** Execute exactly one task per turn.
2. **Respect boundaries.** Never modify files outside the declared `_Boundary:_`. The runtime boundary guard hook (`hooks/boundary-guard.mjs`) will block unlisted edits.
3. **Verify.** Never mark a task `[x]` without running the `_Verification:_` command.
4. **Propagate context.** Append learnings via `ag-sdd complete` after every task.
