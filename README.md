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
> 2. **Boundary Violations**: Agents modifying unlisted files outside the task scope.

---

## 🚀 Step-by-Step Beginner Guide

Welcome to `ag-sdd`! This section walks you through initializing a project and executing your first spec-driven feature step-by-step.

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

### Step 1: Install & Initialize `ag-sdd` in Your Repository

Open a terminal inside your project directory and run:

```bash
# Option A: Install skill globally for all projects on your machine (Recommended)
npx ag-sdd init --global

# Option B: Initialize ag-sdd locally inside your current workspace
npx ag-sdd init
```

**What happens:**
- Scaffolds `.specs/` and persistent steering context (`.specs/.steering/stack.md`, `conventions.md`, `decisions.md`).
- Copies local subagent definitions (`sdd-architect`, `sdd-executor`, `sdd-reviewer`) to `.agents/agents/`.
- Installs the `@ag-sdd` skill into `.agents/skills/ag-sdd/`.
- Registers the runtime system boundary guard (`hooks/boundary-guard.mjs`).

---

### Step 2: Create a New Feature Spec

When starting a new feature (e.g., `user-authentication`), run:

```bash
npx ag-sdd new user-authentication
```

This creates a dedicated spec folder inside `.specs/user-authentication/`:
```
.specs/user-authentication/
├── 00_research.md      # Spike evaluation & prior art comparison
├── 01_requirements.md  # Formal EARS syntax requirements
├── 02_design.md        # Mermaid diagrams, schemas, file boundary plans
├── 03_tasks.md         # Atomic A-C-E task breakdown (50-100+ tasks)
└── 04_signoff.md       # Final QA signoff report
```

---

### Step 3: Run Phase 1 Discovery (`@sdd-discovery`)

In your Antigravity (AGY), Cursor, Windsurf, or Agentic Chat interface, mention `@sdd-discovery`:

```text
@sdd-discovery I want to add JWT user authentication with Refresh Tokens and Rate Limiting.
```

**What the AI agent does:**
1. **Mandatory Codebase Research**: Scans `package.json`, existing APIs, database models, and `.specs/.steering/` BEFORE asking questions.
2. **Interactive UI Questions**: Asks **3 to 5 sharp, architectural questions** via native `ask_question` UI modals with pre-populated choices (e.g., session strategy, password hashing algorithm, rate limit window).
3. **Mandatory Pause**: Stops and waits for your response.

---

### Step 4: Generate the Complete Spec (`@sdd-spec`)

Once you answer the questions, trigger Phase 2 Spec Generation:

```text
@sdd-spec user-authentication
```

**What the AI agent does:**
- Populates `00_research.md` (evaluating libraries like `jose`, `bcrypt`, `redis`).
- Writes testable EARS requirements in `01_requirements.md` (`WHEN user submits valid credentials, THE SYSTEM SHALL issue JWT...`).
- Generates Mermaid architecture diagrams and database ERDs in `02_design.md`.
- Generates an uncapped, granular task breakdown in `03_tasks.md` grouped into Waves (`Wave P0 Foundation` → `Wave P1 Data` → `Wave P2 Auth Services` → `Wave P3 API Routes` → `Wave P4 Testing`).
- Runs `npx ag-sdd linter user-authentication` to verify spec quality.

---

### Step 5: Execute Tasks Bounded & Sequentially (`@sdd-impl`)

Now execute tasks **one at a time**:

```bash
# Check executable next task
npx ag-sdd next

# Begin implementing
npx ag-sdd start user-authentication 1
```

Or simply tell your AI agent:
```text
@sdd-impl user-authentication
```

**Boundary Isolation in Action:**
- The agent reads `_Boundary:_` declared in the task (e.g., `src/auth/jwt.js`).
- If the agent attempts to modify an unlisted file (e.g., `src/users/model.js`), the runtime system **Boundary Guard Hook** (`hooks/boundary-guard.mjs`) automatically blocks the file write and outputs JSON deny reasons.
- After implementing, the agent runs the exact CLI command in `_Verification:_` (e.g., `npm test tests/auth.test.js`).
- Upon passing, it logs structured implementation notes and runs `npx ag-sdd complete user-authentication 1 --note "Implemented JWT signing with RS256"`.

---

### Step 6: Final Quality Signoff (`@sdd-signoff`)

When all tasks in `03_tasks.md` are marked `[x]`, run final verification:

```text
@sdd-signoff user-authentication
```

**What happens:**
1. Runs full project test suite (`npm test`, `npm run lint`, typecheck).
2. Audits `git diff` against original file design boundaries.
3. Generates `04_signoff.md` report with structured audit tables.

---

## 🌟 Key Architectural Features

- **🛡️ Deterministic System Boundary Guard (`hooks/boundary-guard.mjs`)**: System-level `PreToolUse` hook intercepts file modification tools (`write_to_file`, `replace_file_content`, `multi_replace_file_content`) and blocks unlisted file edits with standard JSON schemas.
- **💬 7-Dimension Deep Discovery Protocol**: Scans codebase prior to asking questions. Covers Scope, Data Models, Integrations, Fault Tolerance, Auth, Performance, and UI/UX Behavior.
- **📐 EARS Syntax Requirements (`01_requirements.md`)**: Enforces Easy Approach to Requirements Syntax (`WHEN`, `WHILE`, `WHERE`, `IF...THEN`, `THE SYSTEM SHALL`).
- **⚡ Granular Wave Breakdown**: Vertically sliced wave structures (`P0 Foundation` → `P1 Data Models` → `P2 Repositories` → `P3 Business Logic` → `P4 APIs` → `P5 Testing`) with zero thin thinking.
- **🤖 Specialized SDD Subagents (`.agents/agents/`)**: Pre-configured `sdd-architect`, `sdd-executor`, and `sdd-reviewer` subagents for autonomous multi-agent execution.
- **🎛️ Interactive Mention Commands (`.agent/workflows/`)**: Native `@sdd-discovery`, `@sdd-spec`, `@sdd-impl`, `@sdd-signoff`, and `@sdd-status` workflows.
- **🧠 Context Hygiene & Rot Prevention**: Subagents read selective slice metadata rather than dumping entire context windows on every turn.

---

## 🎛️ Chat Mention Commands

In Antigravity (AGY), Cursor, Windsurf, or IDE chat, use `@` mentions:

| Mention Command | SDD Phase | Action Performed |
|---|---|---|
| `@sdd-discovery <description>` | Phase 1: Discovery | Conducts codebase scan and asks 3-5 sharp UI questions |
| `@sdd-spec <feature-name>` | Phase 2: Spec Gen | Generates `00_research` through `03_tasks` & runs linter |
| `@sdd-impl <feature-name>` | Phase 3: Execution | Executes next task within boundary isolation |
| `@sdd-signoff <feature-name>` | Phase 4: Signoff | Audits git diff, executes full test suite & outputs signoff |
| `@sdd-status` | Matrix Overview | Displays task completion matrix & active in-progress tasks |

---

## 💻 CLI Commands Reference

`ag-sdd` includes a zero-dependency, ultra-fast CLI engine:

```bash
ag-sdd init                             # Scaffold rules, skills, subagents, workflows, hooks
ag-sdd init --global                    # Install @ag-sdd globally into ~/.gemini/
ag-sdd new <feature-name>               # Scaffold a new feature spec from templates
ag-sdd status                           # View task progress matrix across all features
ag-sdd next                             # Display next executable task whose dependencies are satisfied
ag-sdd start <feature> <task>           # Mark a task in-progress [/]
ag-sdd complete <feature> <task> -n "…" # Mark task complete [x] & append implementation note
ag-sdd active                           # Display currently active in-progress task & declared boundary
ag-sdd reset <feature> <task>          # Reset a task back to pending [ ]
ag-sdd graph <feature>                  # Render visual Mermaid DAG flowchart of task dependencies
ag-sdd linter <feature>                 # Audit spec quality against EARS syntax & task completeness
ag-sdd verify                           # Structural verification check across all specs
ag-sdd notes                            # View accumulated implementation notes across features
ag-sdd list                             # List all feature specs and artifact completion status
ag-sdd help                             # Show CLI usage and command options
```

---

## 📐 EARS Syntax Reference

Requirements in `01_requirements.md` follow **Easy Approach to Requirements Syntax**:

| Pattern | Template | Example |
|---|---|---|
| **Ubiquitous** | The `<system>` shall `<response>`. | The application shall log all auth events. |
| **Event-Driven** | When `<trigger>`, the `<system>` shall `<response>`. | When a user submits credentials, the system shall validate password hash. |
| **State-Driven** | While `<state>`, the `<system>` shall `<response>`. | While session is active, the system shall refresh access tokens. |
| **Unwanted Behavior** | If `<condition>`, then the `<system>` shall `<response>`. | If rate limit is exceeded, then the system shall return HTTP 429. |
| **Optional Feature** | Where `<feature>`, the `<system>` shall `<response>`. | Where OAuth is enabled, the system shall render Social Login buttons. |

---

## 🤖 Subagent Persona Architecture

`ag-sdd` equips your AI workspace with specialized subagents optimized for **Gemini 3.6 Flash / Pro**, **Claude 3.7 Opus**, **DeepSeek R1**, and **GPT-4o**:

- **`sdd-architect`**: Expert software architect. Formulates non-shallow questions, drafts EARS requirements, creates Mermaid architecture diagrams, and generates uncapped task lists.
- **`sdd-executor`**: Bounded code builder. Executes single tasks strictly within declared `_Boundary:_` file boundaries, runs empirical test commands, and logs learnings.
- **`sdd-reviewer`**: Quality assurance auditor. Audits `git diff`, verifies full test suites, checks requirement traceability, and generates signoff reports.

---

## 🌐 AI Ecosystem & Tool Integration

`ag-sdd` seamlessly integrates with modern AI development tools:

- **Google Antigravity (AGY 2.0)**: Native support for slash commands, workflows, hooks, subagents, and sidecars.
- **Model Context Protocol (MCP)**: Works alongside MCP servers for search, database inspection, and API testing.
- **`generate_image`**: Automatically used during design phase for UI wireframes and visual asset creation.
- **`search_web`**: Used during research phase for library evaluations and prior art comparisons.
- **`schedule`**: Used for non-blocking timers on long-running test suites.
- **`ask_question`**: Used for multi-select, interactive clarification interviews.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting pull requests.

---

## 📄 License

[MIT License](./LICENSE) © 2026 Anti-Gravity SDD Contributors
