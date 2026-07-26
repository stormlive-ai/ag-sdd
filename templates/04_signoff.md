# Signoff: {{FEATURE_NAME}}

<!--
  Instructions for the Agent:
  Use this template to document the completion of the feature, verify quality, and record signoff status.
-->

## Summary
- **Feature Implemented:** {{FEATURE_NAME}}
- **Total Tasks Completed:** {{COMPLETED_TASK_COUNT}}
- **Date Range:** {{START_DATE}} to {{END_DATE}}

## Verification Results
<!-- Summarize the results of verification commands run during the implementation. -->
| Check | Command | Result | Notes |
|---|---|---|---|
| {{CHECK_NAME}} | `{{COMMAND}}` | {{RESULT}} | {{NOTES}} |

## Task Completion Log
<!-- Record the final status of all tasks from the execution plan. -->
| Task # | Title | Status | Verification |
|---|---|---|---|
| {{TASK_NUMBER}} | {{TASK_TITLE}} | {{STATUS}} | {{VERIFICATION_STATUS}} |

## Deviations from Spec
<!-- Document any changes made during implementation that differ from the original design, along with the rationale. -->
- **{{DEVIATION}}**: {{RATIONALE}}

## Known Issues & Technical Debt
<!-- List any remaining issues, unhandled edge cases, or technical debt incurred during implementation. -->
- [ ] {{KNOWN_ISSUE_OR_DEBT}}

## Follow-Up Recommendations
<!-- Suggest next steps, future enhancements, or related tasks. -->
- {{RECOMMENDATION}}

## Approval
- **Status:** {{SIGNOFF_STATUS}} <!-- e.g., Pending, Approved, Rejected -->
- **Approved By:** {{APPROVER_NAME}}
- **Approval Date:** {{APPROVAL_DATE}}
