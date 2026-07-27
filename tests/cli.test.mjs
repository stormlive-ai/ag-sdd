import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CLI_PATH = path.resolve(import.meta.dirname, '..', 'bin', 'cli.mjs');

function runCli(args = [], cwd = undefined) {
  try {
    const result = execFileSync('node', [CLI_PATH, ...args], {
      encoding: 'utf8',
      cwd: cwd || process.cwd(),
      env: { ...process.env, NO_COLOR: '1' },
      timeout: 10000,
    });
    return { stdout: result, exitCode: 0 };
  } catch (err) {
    return { stdout: err.stdout || '', stderr: err.stderr || '', exitCode: err.status };
  }
}

describe('ag-sdd CLI', () => {
  describe('help', () => {
    it('should display help text with all commands', () => {
      const { stdout } = runCli(['help']);
      assert.ok(stdout.includes('ag-sdd'), 'Should include tool name');
      assert.ok(stdout.includes('init'), 'Should include init command');
      assert.ok(stdout.includes('new'), 'Should include new command');
      assert.ok(stdout.includes('status'), 'Should include status command');
      assert.ok(stdout.includes('next'), 'Should include next command');
      assert.ok(stdout.includes('start'), 'Should include start command');
      assert.ok(stdout.includes('complete'), 'Should include complete command');
      assert.ok(stdout.includes('verify'), 'Should include verify command');
    });

    it('should display version number', () => {
      const { stdout } = runCli(['help']);
      assert.ok(stdout.includes('v0.2.0'), 'Should include version 0.2.0');
    });
  });

  describe('init', () => {
    let tmpDir;

    before(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-sdd-test-'));
    });

    after(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('should create .specs directory', () => {
      runCli(['init', '--force'], tmpDir);
      assert.ok(fs.existsSync(path.join(tmpDir, '.specs')), '.specs/ should exist');
    });

    it('should create AGENTS.md', () => {
      assert.ok(fs.existsSync(path.join(tmpDir, 'AGENTS.md')), 'AGENTS.md should exist');
    });

    it('should create rules directory', () => {
      assert.ok(fs.existsSync(path.join(tmpDir, 'rules', 'ag-sdd-rules.md')), 'rules/ag-sdd-rules.md should exist');
    });

    it('should create .agents/agents/ with subagent definitions', () => {
      assert.ok(fs.existsSync(path.join(tmpDir, '.agents', 'agents', 'sdd-architect.md')), 'sdd-architect.md should exist');
      assert.ok(fs.existsSync(path.join(tmpDir, '.agents', 'agents', 'sdd-executor.md')), 'sdd-executor.md should exist');
      assert.ok(fs.existsSync(path.join(tmpDir, '.agents', 'agents', 'sdd-reviewer.md')), 'sdd-reviewer.md should exist');
    });

    it('should create .agents/skills/ag-sdd/ with SKILL.md', () => {
      assert.ok(fs.existsSync(path.join(tmpDir, '.agents', 'skills', 'ag-sdd', 'SKILL.md')), 'SKILL.md should exist in .agents/skills/ag-sdd/');
    });

    it('should create steering directory with initial files', () => {
      assert.ok(fs.existsSync(path.join(tmpDir, '.specs', '.steering', 'stack.md')), 'stack.md should exist');
      assert.ok(fs.existsSync(path.join(tmpDir, '.specs', '.steering', 'conventions.md')), 'conventions.md should exist');
      assert.ok(fs.existsSync(path.join(tmpDir, '.specs', '.steering', 'decisions.md')), 'decisions.md should exist');
    });

    it('should show next-step guidance', () => {
      const { stdout } = runCli(['init', '--force'], tmpDir);
      assert.ok(stdout.includes('Next step'), 'Should include next step guidance');
      assert.ok(stdout.includes('ag-sdd new'), 'Should mention the new command');
    });
  });

  describe('new', () => {
    let tmpDir;

    before(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-sdd-test-'));
      runCli(['init', '--force'], tmpDir);
    });

    after(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('should create feature spec directory', () => {
      runCli(['new', 'test-feature', '--force'], tmpDir);
      assert.ok(fs.existsSync(path.join(tmpDir, '.specs', 'test-feature')), 'Feature dir should exist');
    });

    it('should only copy spec-related files', () => {
      const featureDir = path.join(tmpDir, '.specs', 'test-feature');
      const files = fs.readdirSync(featureDir);
      // Should NOT contain AGENTS.override.md or hooks.json
      assert.ok(!files.includes('AGENTS.override.md'), 'Should not contain AGENTS.override.md');
      assert.ok(!files.includes('hooks.json'), 'Should not contain hooks.json');
      // Should contain spec files
      assert.ok(files.some(f => f.includes('requirements') || f.includes('01_')), 'Should contain requirements');
    });

    it('should show next-step guidance', () => {
      const { stdout } = runCli(['new', 'guidance-test', '--force'], tmpDir);
      assert.ok(stdout.includes('Next step') || stdout.includes('@sdd-discovery'), 'Should include next step guidance');
    });

    it('should error without feature name', () => {
      const { exitCode } = runCli(['new'], tmpDir);
      assert.ok(exitCode !== 0, 'Should exit with error');
    });
  });

  describe('parseTasks (via status)', () => {
    let tmpDir;

    before(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-sdd-test-'));
      fs.mkdirSync(path.join(tmpDir, '.specs', 'test-feature'), { recursive: true });
      fs.writeFileSync(path.join(tmpDir, '.specs', 'test-feature', '03_tasks.md'), `
# Tasks
- [x] **Task 1: Setup project**
  - _Action:_ Initialize project
  - _Boundary:_ \`package.json\`
  - _Depends:_ \`None\`
  - _Verification:_ \`npm test\`

- [/] **Task 2: Add auth**
  - _Action:_ Implement auth
  - _Boundary:_ \`src/auth.js\`
  - _Depends:_ \`Task 1\`
  - _Verification:_ \`npm test\`

- [ ] **Task 3: Add dashboard**
  - _Action:_ Build dashboard
  - _Boundary:_ \`src/dashboard.js\`
  - _Depends:_ \`Task 2\`
  - _Verification:_ \`npm test\`
`);
    });

    after(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('should count in-progress tasks in status', () => {
      const { stdout } = runCli(['status'], tmpDir);
      // Should show 1 in the in-progress column
      assert.ok(stdout.includes('1') && stdout.includes('test-feature'), 'Should show test-feature with counts');
    });

    it('should show next-step guidance in status', () => {
      const { stdout } = runCli(['status'], tmpDir);
      assert.ok(stdout.includes('ag-sdd next'), 'Should include next command hint');
    });
  });
});
