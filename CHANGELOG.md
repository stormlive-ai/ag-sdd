# Changelog

All notable changes to `ag-sdd` will be documented in this file.

## [0.2.0] - 2026-07-27

### Added
- **Question Engineering Protocol**: Pre-question codebase scan, 7-dimension ambiguity detection checklist, anti-shallow question blocklist for `sdd-architect`.
- **Persistent Project Context**: Auto-scaffold `.specs/.steering/` templates (`stack.md`, `conventions.md`, `decisions.md`) during `init`.
- **Lean Project AGENTS.md Template**: Added `templates/AGENTS.project.md` (~80 lines) for target projects.
- **Antigravity Tool Suite Integration**: Full integration of `generate_image`, `search_web`, `define_subagent`, `schedule`, and `ask_question`.
- **Automated Test Suite**: Added `tests/cli.test.mjs` and `tests/boundary-guard.test.mjs` with 20 unit tests.
- **GitHub Actions CI/CD**: Added `.github/workflows/publish.yml` for automated testing and npm publishing.

### Fixed
- **Local Skill Installation**: `cmdInit()` now installs `.agents/skills/ag-sdd/` locally.
- **Task Counting**: `cmdStatus()` now accurately counts `[/]` in-progress tasks.
- **Template Copying**: `cmdNew()` now strictly copies spec files, excluding non-spec files.
- **Boundary Guard JSON**: Updated `hooks/boundary-guard.mjs` to output standard JSON (`{"decision": "deny", "reason": "..."}`).
- **EARS Linter**: Fixed clause matching regex to evaluate list item line prefixes instead of arbitrary words.
- **CLI Navigation**: Added next-step guidance to `init`, `new`, `status`, `next`, `start`, and `complete`.

## [0.1.1] - 2026-07-26

### Added
- **Skill Isolation**: Isolated `skills/ag-sdd/` directory for clean `npx skills add` installations.
- **Model Tier Support**: Added `pro`, `flash`, and `flash_lite` (Nano) tier selection for subagents.
- **Complete Feature Matrix**: 100% integration of Antigravity features (PreToolUse & Stop hooks, MCP definitions, subagents, workflows).
