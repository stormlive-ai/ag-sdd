name: Bug Report
description: Create a report to help us improve ag-sdd
title: '[BUG]: '
labels: ['bug', 'triage']
assignees: ''
body:
  - type: markdown
    attributes:
      value: Thanks for taking the time to report a bug in ag-sdd!
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear and concise description of what the bug is.
      placeholder: What went wrong?
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Step-by-step instructions to reproduce the issue.
      placeholder: |
        1. Run 'ag-sdd init'
        2. Run 'ag-sdd start feature 1'
        3. See error
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: A clear description of what you expected to happen.
    validations:
      required: true
  - type: textarea
    id: environment
    attributes:
      label: Environment Info
      description: Node version, OS, Antigravity/Agentic environment
      placeholder: |
        - OS: Windows 11 / macOS / Ubuntu
        - Node version: v20.x
        - Model: Gemini 3.6 Flash / Claude Opus 4.6 / GPT-4o
        - ag-sdd version: 0.2.0
    validations:
      required: true
