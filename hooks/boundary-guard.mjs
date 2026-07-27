#!/usr/bin/env node

/**
 * ag-sdd Antigravity Lifecycle Guard & Hook Bundle
 * 
 * Supports:
 * - PreToolUse: Intercepts file modification tools and blocks unlisted edits (Exit 2 Deny)
 * - PostToolUse: Logs task activity
 * - Stop: Prevents execution loop termination if a task is left in-progress [/]
 */

import fs from 'fs';
import path from 'path';
import process from 'process';

async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
  });
}

function normalizePath(p) {
  if (!p) return '';
  return path.normalize(p).toLowerCase().replace(/\\/g, '/');
}

function parseTasks(content) {
  const tasks = [];
  const lines = content.split('\n');
  let currentTask = null;

  for (const line of lines) {
    const taskMatch = line.match(/^\s*- \[([\s xX\/])\] \*\*(.+?)\*\*/);
    if (taskMatch) {
      const status = taskMatch[1].trim().toLowerCase();
      currentTask = {
        done: status === 'x',
        inProgress: status === '/',
        title: taskMatch[2].trim(),
        boundary: []
      };
      tasks.push(currentTask);
    } else if (currentTask) {
      const boundaryMatch = line.match(/_Boundary:_\s*(.+)/);
      if (boundaryMatch) {
        const raw = boundaryMatch[1].trim();
        currentTask.boundary = raw.split(',').map(b => normalizePath(b.trim().replace(/`/g, ''))).filter(Boolean);
      }
    }
  }
  return tasks;
}

async function main() {
  try {
    const rawInput = await readStdin();
    if (!rawInput) {
      process.exit(0);
    }

    const payload = JSON.parse(rawInput);
    const hookType = process.argv[2] || 'PreToolUse';

    const cwd = process.cwd();
    const specsDir = path.join(cwd, '.specs');

    // 1. Handle Stop Lifecycle Hook
    if (hookType === 'Stop') {
      if (fs.existsSync(specsDir)) {
        const features = fs.readdirSync(specsDir).filter(f => fs.statSync(path.join(specsDir, f)).isDirectory());
        for (const feature of features) {
          const tasksFile = path.join(specsDir, feature, '03_tasks.md');
          if (fs.existsSync(tasksFile)) {
            const content = fs.readFileSync(tasksFile, 'utf8');
            const tasks = parseTasks(content);
            const inProgress = tasks.find(t => t.inProgress);
            if (inProgress) {
              console.log(JSON.stringify({
                decision: "continue",
                reason: `Task "${inProgress.title}" in [${feature}] is still in-progress [/]. Complete verification or run 'ag-sdd reset ${feature} "${inProgress.title}"' before stopping.`
              }));
              process.exit(0);
            }
          }
        }
      }
      process.exit(0);
    }

    // 2. Handle PreToolUse Lifecycle Hook
    const toolName = payload.toolName || payload.tool_name || '';
    const toolInput = payload.toolInput || payload.tool_input || {};

    let targetFile = toolInput.TargetFile || toolInput.targetFile || toolInput.AbsolutePath || toolInput.path || '';
    if (!targetFile) {
      process.exit(0);
    }

    const normTarget = normalizePath(targetFile);

    // Whitelist specs, rules, agents, and system paths
    if (normTarget.includes('/.specs/') || 
        normTarget.includes('/.agents/') || 
        normTarget.includes('/rules/') || 
        normTarget.includes('/workflows/') ||
        normTarget.endsWith('task.md') ||
        normTarget.endsWith('implementation_plan.md') ||
        normTarget.endsWith('walkthrough.md')) {
      process.exit(0);
    }

    if (!fs.existsSync(specsDir)) {
      process.exit(0);
    }

    const features = fs.readdirSync(specsDir).filter(f => fs.statSync(path.join(specsDir, f)).isDirectory());
    
    let activeTask = null;
    let activeFeature = null;

    for (const feature of features) {
      const tasksFile = path.join(specsDir, feature, '03_tasks.md');
      if (fs.existsSync(tasksFile)) {
        const content = fs.readFileSync(tasksFile, 'utf8');
        const tasks = parseTasks(content);
        const inProgress = tasks.find(t => t.inProgress);
        if (inProgress) {
          activeTask = inProgress;
          activeFeature = feature;
          break;
        }
      }
    }

    if (!activeTask) {
      process.exit(0);
    }

    const isAllowed = activeTask.boundary.some(b => normTarget.endsWith(b) || normTarget.includes(b));

    if (!isAllowed) {
      console.log(JSON.stringify({
        decision: "deny",
        reason: `Boundary violation: "${path.basename(targetFile)}" is not in the declared boundary for task "${activeTask.title}" (${activeFeature}). Allowed: [${activeTask.boundary.join(', ')}]. Update _Boundary:_ in .specs/${activeFeature}/03_tasks.md to include this file.`
      }));
      process.exit(2);
    }

    process.exit(0);
  } catch (err) {
    process.exit(0);
  }
}

main();
