name: Feature Request
description: Suggest an idea or enhancement for ag-sdd
title: '[FEAT]: '
labels: ['enhancement']
assignees: ''
body:
  - type: markdown
    attributes:
      value: Have an idea to make ag-sdd better? Tell us about it!
  - type: textarea
    id: feature-description
    attributes:
      label: Feature Description
      description: Describe the feature you would like to see added.
    validations:
      required: true
  - type: textarea
    id: rationale
    attributes:
      label: Problem / Use Case
      description: What problem does this solve? What is the rationale?
    validations:
      required: true
  - type: textarea
    id: proposed-solution
    attributes:
      label: Proposed Solution
      description: Describe how you envision this feature working (CLI command, hook, subagent).
    validations:
      required: false
