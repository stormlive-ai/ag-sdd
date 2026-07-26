# Contributing to `ag-sdd`

Thank you for your interest in contributing to `ag-sdd`!

## Development Guidelines

1. **Architecture Philosophy**:
   - `ag-sdd` CLI must remain **pure Node.js ESM** with zero external dependencies.
   - All specs follow EARS syntax and A-C-E task formats.
   - Runtime hooks must be lightweight and execute in under 20ms.

2. **Local Testing**:
   ```bash
   # Test CLI locally
   node ./bin/cli.mjs help
   
   # Run verification checks
   npm run verify
   ```

3. **Submitting Pull Requests**:
   - Ensure `npm run verify` passes cleanly.
   - Update `CHANGELOG.md` with your changes.
   - Submit PR with clear summary of architectural changes.
