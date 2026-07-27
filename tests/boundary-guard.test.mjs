import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const GUARD_PATH = path.resolve(import.meta.dirname, '..', 'hooks', 'boundary-guard.mjs');

function runGuard(hookType, input, cwd) {
  try {
    const result = execFileSync('node', [GUARD_PATH, hookType], {
      encoding: 'utf8',
      cwd,
      input: JSON.stringify(input),
      timeout: 10000,
    });
    return { stdout: result, exitCode: 0 };
  } catch (err) {
    return { stdout: err.stdout || '', stderr: err.stderr || '', exitCode: err.status };
  }
}

describe('boundary-guard.mjs', () => {
  let tmpDir;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-sdd-guard-'));
    // Create a feature with an in-progress task that has a specific boundary
    fs.mkdirSync(path.join(tmpDir, '.specs', 'auth'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, '.specs', 'auth', '03_tasks.md'), `
- [/] **Task 1: Add login**
  - _Action:_ Create login page
  - _Boundary:_ \`src/auth/login.js\`, \`src/auth/login.css\`
  - _Depends:_ \`None\`
  - _Verification:_ \`npm test\`
`);
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should allow file within boundary', () => {
    const { exitCode } = runGuard('PreToolUse', {
      toolName: 'write_to_file',
      toolInput: { TargetFile: path.join(tmpDir, 'src', 'auth', 'login.js') }
    }, tmpDir);
    assert.equal(exitCode, 0, 'Should allow file within boundary');
  });

  it('should deny file outside boundary with JSON output', () => {
    const { stdout, exitCode } = runGuard('PreToolUse', {
      toolName: 'write_to_file',
      toolInput: { TargetFile: path.join(tmpDir, 'src', 'dashboard', 'main.js') }
    }, tmpDir);
    assert.equal(exitCode, 2, 'Should exit with code 2');
    const parsed = JSON.parse(stdout.trim());
    assert.equal(parsed.decision, 'deny', 'Should have deny decision');
    assert.ok(parsed.reason.includes('Boundary violation'), 'Should include boundary violation message');
  });

  it('should always allow .specs/ files', () => {
    const { exitCode } = runGuard('PreToolUse', {
      toolName: 'write_to_file',
      toolInput: { TargetFile: path.join(tmpDir, '.specs', 'auth', '03_tasks.md') }
    }, tmpDir);
    assert.equal(exitCode, 0, 'Should allow .specs/ files');
  });

  it('should pass through when no active task', () => {
    const noTaskDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-sdd-guard-notask-'));
    fs.mkdirSync(path.join(noTaskDir, '.specs', 'feature'), { recursive: true });
    fs.writeFileSync(path.join(noTaskDir, '.specs', 'feature', '03_tasks.md'), `
- [x] **Task 1: Done**
  - _Boundary:_ \`src/a.js\`
`);
    const { exitCode } = runGuard('PreToolUse', {
      toolName: 'write_to_file',
      toolInput: { TargetFile: path.join(noTaskDir, 'any', 'file.js') }
    }, noTaskDir);
    assert.equal(exitCode, 0, 'Should pass through when no active task');
    fs.rmSync(noTaskDir, { recursive: true, force: true });
  });

  it('should handle Stop hook with in-progress task', () => {
    const { stdout, exitCode } = runGuard('Stop', {}, tmpDir);
    assert.equal(exitCode, 0, 'Should exit cleanly');
    if (stdout.trim()) {
      const parsed = JSON.parse(stdout.trim());
      assert.equal(parsed.decision, 'continue', 'Should recommend continue');
    }
  });
});
