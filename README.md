# `ag-sdd` — Anti-Gravity Spec-Driven Development (AGY)

[![npm version](https://img.shields.io/npm/v/ag-sdd.svg?color=cb3837&style=flat-svg)](https://www.npmjs.com/package/ag-sdd)
[![npm downloads](https://img.shields.io/npm/dm/ag-sdd.svg?style=flat-svg)](https://www.npmjs.com/package/ag-sdd)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518.0.0-green.svg?style=flat-svg)](https://nodejs.org)
[![Antigravity](https://img.shields.io/badge/Anti--Gravity-2.0%20Compatible-blue.svg?style=flat-svg)](https://antigravity.google)
[![Spec-Driven](https://img.shields.io/badge/SDD-EARS%20Syntax-purple.svg?style=flat-svg)](#-ears-syntax-reference)
[![CI Build](https://github.com/stormlive-ai/ag-sdd/actions/workflows/publish.yml/badge.svg)](https://github.com/stormlive-ai/ag-sdd/actions)

> **The production-grade Spec-Driven Development (SDD) harness and skill suite built specifically for Google Antigravity (AGY), Gemini 3.6 Flash/Pro, Claude 3.7 Opus, DeepSeek R1, GPT-4o, and modern Agentic Coding environments (Cursor, Windsurf, Kiro IDE, Devin, Cline, Roo Code).**  
> 
> Eliminates the two primary failure modes of AI coding agents:
> 1. **Thin Thinking**: Shallow, 3-task plans that collapse on complex features.
> 2. **Boundary Violations**: Agents modifying unlisted files outside declared task scope.

---

## 🚀 Quick Start Guide: Automated vs Manual Workflows

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             AG-SDD WORKFLOW LIFECYCLE                            │
│                                                                                  │
│   1. DISCOVERY          2. SPEC GEN            3. EXECUTION         4. SIGNOFF   │
│  ┌───────────┐         ┌───────────┐          ┌────────────┐       ┌───────────┐ │
│  │ @sdd-disc │────────▶│ @sdd-spec │─────────▶│  @sdd-impl │──────▶│@sdd-signoff│ │
│  │ 3-5 Sharp │         │ EARS Req  │          │ 1 Task/Turn│       │ 100% Test │ │
│  │ Questions │         │ 50+ Tasks │          │ Boundary   │       │ Signoff   │ │
│  └───────────┘         └───────────┘          └────────────┘       └───────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

### ⚡ Path A: The Automated Agent Path (Recommended & Easiest)

Once `@ag-sdd` is installed, **your AI Agent handles all CLI execution, task tracking, and boundary enforcement automatically behind the scenes**! You simply direct the agent using `@` mentions.

#### Step 1: Install `@ag-sdd`

In your chat or terminal, install the skill globally:
```bash
npx ag-sdd init --global
```

#### Step 2: Start Discovery (`@sdd-discovery`)

In your Antigravity (AGY), Cursor, or IDE chat, tell the agent what you want to build:
```text
@sdd-discovery Add JWT user authentication with Refresh Tokens and Rate Limiting.
```
**What the Agent does automatically:**
- Scans `package.json`, existing APIs, database models, and `.specs/.steering/`.
- Presents **3 to 5 sharp, interactive UI questions** with pre-populated options.
- Pauses for your answers.

#### Step 3: Generate Specs (`@sdd-spec`)

After answering the questions, trigger spec generation:
```text
@sdd-spec user-authentication
```
**What the Agent does automatically:**
- Scaffolds `.specs/user-authentication/` (`00_research.md`, `01_requirements.md`, `02_design.md`, `03_tasks.md`, `04_signoff.md`).
- Writes EARS requirements and Mermaid architecture diagrams.
- Generates 50-100+ granular, wave-structured tasks in `03_tasks.md`.
- Runs `npx ag-sdd linter` to verify spec quality.

#### Step 4: Execute Tasks (`@sdd-impl`)

To implement tasks sequentially, simply say:
```text
@sdd-impl user-authentication
```
**What the Agent does automatically:**
- Runs `npx ag-sdd next` to pick the next executable task.
- Calls `npx ag-sdd start` to activate the task.
- Reads `_Boundary:_` declared in the task and writes code strictly within boundary files (runtime **Boundary Guard Hook** blocks any unlisted edits).
- Runs `_Verification:_` test commands empirically.
- Calls `npx ag-sdd complete` with structured implementation notes.

#### Step 5: Final Signoff (`@sdd-signoff`)

When all tasks are finished:
```text
@sdd-signoff user-authentication
```
**What the Agent does automatically:**
- Runs full test suite (`npm test`, lint, typecheck).
- Audits `git diff` against design spec.
- Populates `04_signoff.md` QA report.

---

### 💻 Path B: The Manual CLI Path (Terminal-First Workflow)

If you prefer operating from the terminal or using custom scripts, you can drive the workflow manually using the `ag-sdd` CLI:

```bash
# 1. Initialize ag-sdd workspace
npx ag-sdd init

# 2. Create a new feature spec from templates
npx ag-sdd new user-authentication

# 3. View task progress matrix
npx ag-sdd status

# 4. Find the next executable task whose dependencies are met
npx ag-sdd next

# 5. Start working on task 1
npx ag-sdd start user-authentication 1

# 6. Complete task 1 and record implementation learnings
npx ag-sdd complete user-authentication 1 --note "Implemented JWT signing with RS256"

# 7. Render dependency DAG flowchart
npx ag-sdd graph user-authentication

# 8. Lint spec quality against EARS syntax
npx ag-sdd linter user-authentication
```

---

## 🏛️ Deep-Dive Explanation & System Architecture

Now that you know both execution paths, here is how `ag-sdd` guarantees production-grade reliability:

### 1. Deterministic System Boundary Guard (`hooks/boundary-guard.mjs`)
A system-level `PreToolUse` hook intercepts file modification tools (`write_to_file`, `replace_file_content`, `multi_replace_file_content`). If an agent attempts to modify a file outside the task's declared `_Boundary:_`, the hook blocks the call and returns standard JSON deny schemas (`{"decision": "deny", "reason": "..."}`).

### 2. EARS Syntax Requirements (`01_requirements.md`)
All functional requirements use formal **Easy Approach to Requirements Syntax**:
- **Ubiquitous**: The `<system>` shall `<response>`.
- **Event-Driven**: When `<trigger>`, the `<system>` shall `<response>`.
- **State-Driven**: While `<state>`, the `<system>` shall `<response>`.
- **Unwanted Behavior**: If `<condition>`, then the `<system>` shall `<response>`.
- **Optional Feature**: Where `<feature>`, the `<system>` shall `<response>`.

### 3. Persistent Project Context (`.specs/.steering/`)
To prevent re-asking settled questions across features, `ag-sdd` maintains persistent steering files:
- `.specs/.steering/stack.md`: Technology stack decisions.
- `.specs/.steering/conventions.md`: Code style and structural conventions.
- `.specs/.steering/decisions.md`: Accumulated architectural decision log.

### 4. Specialized Multi-Agent Personas (`.agents/agents/`)
- **`sdd-architect`**: Pre-question codebase scan, 7-dimension ambiguity detection, EARS requirements, Mermaid diagrams, uncapped task lists.
- **`sdd-executor`**: Bounded single-task execution, context hygiene protocol, UI task generation (`generate_image`), non-blocking test scheduling.
- **`sdd-reviewer`**: Full test suite verification, git diff audit, requirements traceability matrix, signoff report generation.

---

## 🎛️ Chat Mention Commands Summary

| Mention Command | SDD Phase | Action Performed |
|---|---|---|
| `@sdd-discovery <description>` | Phase 1: Discovery | Conducts codebase scan and asks 3-5 sharp UI questions |
| `@sdd-spec <feature-name>` | Phase 2: Spec Gen | Generates `00_research` through `03_tasks` & runs linter |
| `@sdd-impl <feature-name>` | Phase 3: Execution | Executes next task within boundary isolation |
| `@sdd-signoff <feature-name>` | Phase 4: Signoff | Audits git diff, executes full test suite & outputs signoff |
| `@sdd-status` | Matrix Overview | Displays task completion matrix & active in-progress tasks |

---

## 💻 CLI Commands Matrix

| CLI Command | Description |
|---|---|
| `ag-sdd init` | Scaffold rules, skills, subagents, workflows, hooks |
| `ag-sdd init --global` | Install `@ag-sdd` globally into `~/.gemini/` |
| `ag-sdd new <feature-name>` | Scaffold a new feature spec from templates |
| `ag-sdd status` | View task progress matrix across all features |
| `ag-sdd next` | Display next executable task whose dependencies are satisfied |
| `ag-sdd start <feature> <task>` | Mark a task in-progress `[/]` |
| `ag-sdd complete <feature> <task> -n "…"` | Mark task complete `[x]` & append implementation note |
| `ag-sdd active` | Display currently active in-progress task & declared boundary |
| `ag-sdd reset <feature> <task>` | Reset a task back to pending `[ ]` |
| `ag-sdd graph <feature>` | Render visual Mermaid DAG flowchart of task dependencies |
| `ag-sdd linter <feature>` | Audit spec quality against EARS syntax & task completeness |
| `ag-sdd verify` | Structural verification check across all specs |
| `ag-sdd notes` | View accumulated implementation notes across features |
| `ag-sdd list` | List all feature specs and artifact completion status |

---

## 🤖 AI Ecosystem & Model Compatibility

`ag-sdd` is tested and optimized for:
- **Models**: Gemini 3.6 Flash / Pro, Claude 3.7 Opus, DeepSeek R1 / V3, GPT-4o
- **Platforms**: Google Antigravity (AGY 2.0), Cursor, Windsurf, Kiro IDE, Devin, Cline, Roo Code
- **Protocols**: Model Context Protocol (MCP), Native Hooks, Skills Architecture

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting pull requests.

---

## 📄 License

[MIT License](./LICENSE) © 2026 Anti-Gravity SDD Contributors
