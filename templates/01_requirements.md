# Requirements: {{FEATURE_NAME}}

<!--
  Instructions for the Agent:
  Use this template to define the requirements for the feature using the EARS (Easy Approach to Requirements Syntax) pattern.
  Ensure requirements are clear, testable, and unambiguous.
-->

## Overview
<!-- Provide a brief description of the feature and its intended value. -->
{{OVERVIEW}}

## User Stories
<!-- List user stories in the standard format. -->
- As a [role], I want [capability], so that [benefit]

## Functional Requirements
<!-- 
  Define functional requirements using EARS syntax. 
  
  EARS Pattern Reference:
  - Ubiquitous: The <system> shall <response>.
  - Event-Driven: When <trigger>, the <system> shall <response>.
  - State-Driven: While <state>, the <system> shall <response>.
  - Unwanted Behavior: If <condition>, then the <system> shall <response>.
  - Optional Feature: Where <feature>, the <system> shall <response>.
-->

### Ubiquitous Requirements
- The `{{SYSTEM}}` shall `{{RESPONSE}}`.

### Event-Driven Requirements
- When `{{TRIGGER}}`, the `{{SYSTEM}}` shall `{{RESPONSE}}`.

### State-Driven Requirements
- While `{{STATE}}`, the `{{SYSTEM}}` shall `{{RESPONSE}}`.

### Unwanted Behavior
- If `{{CONDITION}}`, then the `{{SYSTEM}}` shall `{{RESPONSE}}`.

### Optional Feature
- Where `{{FEATURE}}`, the `{{SYSTEM}}` shall `{{RESPONSE}}`.

## Non-Functional Requirements
<!-- Document requirements related to performance, security, scalability, accessibility, etc. -->
- **Performance:** {{REQUIREMENT}}
- **Security:** {{REQUIREMENT}}
- **Scalability:** {{REQUIREMENT}}
- **Accessibility:** {{REQUIREMENT}}

## Acceptance Criteria
<!-- Provide a numbered list of testable criteria that must be met for the feature to be considered complete. -->
1. {{CRITERIA_1}}
2. {{CRITERIA_2}}

## Out of Scope
<!-- Explicitly list items, edge cases, or features that are intentionally excluded from this effort. -->
- {{OUT_OF_SCOPE_ITEM}}
