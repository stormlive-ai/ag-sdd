# Tasks: {{FEATURE_NAME}}

<!--
  Instructions for the Agent:
  This is the MOST CRITICAL template. It defines the execution plan.
  Ensure tasks follow the A-C-E (Action-Context-Execution) format and specify boundaries and dependencies.
-->

## Metadata
- **Feature Name:** {{FEATURE_NAME}}
- **Scope Category:** {{SCOPE_CATEGORY}} <!-- e.g., Small Fix, Medium Feature, Large Feature -->
- **Estimated Task Count:** {{ESTIMATED_TASK_COUNT}}
- **Spec Created Date:** {{CREATION_DATE}}

## Granularity Reference
| Scope | Min Tasks | Recommended Task Range | Wave Structure |
|---|---|---|---|
| Small Fix | 5 | 5–15 | Wave P0 → Wave P1 |
| Medium Feature | 20 | 20–45 | Wave P0 → P1 → P2 → P3 |
| Large Feature / Greenfield App | 50 | 50–100+ (Uncapped) | Wave P0 → P1 → P2 → P3 → P4 → P5 |

## Task List
<!-- 
  Define the tasks required to implement the feature. 
  Follow the A-C-E format strictly.
-->

- [ ] **Task 1: Setup Core Interfaces**
  - _Action:_ Define the primary data structures and interfaces for the feature.
  - _Context:_ Establishing contracts early ensures dependent modules can be developed in parallel.
  - _Execution:_ Create `types.ts` and define `User` and `Session` interfaces.
  - _Boundary:_ `src/types.ts`
  - _Depends:_ `None`
  - _Verification:_ `npx tsc --noEmit`

- [ ] **Task 2: Implement Data Access Layer**
  - _Action:_ Create the repository class for database interactions.
  - _Context:_ Needs to implement the interfaces defined in Task 1. Ensure SQL injection safeguards.
  - _Execution:_ Create `UserRepository` class with `findById` and `save` methods.
  - _Boundary:_ `src/repositories/user.repository.ts`
  - _Depends:_ `Task 1`
  - _Verification:_ `npm test -- user.repository.test.ts`

- [ ] **Task {{N}}: {{TASK_TITLE}}**
  - _Action:_ {{WHAT_TO_PRODUCE}}
  - _Context:_ {{WHY_THIS_TASK_EXISTS_AND_CONSTRAINTS}}
  - _Execution:_ {{STEP_BY_STEP_INSTRUCTIONS}}
  - _Boundary:_ `{{FILE_PATHS}}`
  - _Depends:_ `{{DEPENDENCIES}}`
  - _Verification:_ `{{VERIFICATION_COMMAND}}`

## Implementation Notes
<!-- 
  Agents: Append notes here after completing each task.
  Format:
  ### Task N: <Title> — Notes
  - **Completed:** <timestamp>
  - **Decisions:** <key decisions>
  - **Gotchas:** <issues encountered>
  - **Contracts:** <interfaces discovered>
  - **Deviations:** <any spec changes>
  - **Next Task Context:** <info for next task>
-->
