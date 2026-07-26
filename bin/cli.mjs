#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const CWD = process.cwd();

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

const VERSION = '0.1.1';

function getPackageVersion() {
  try {
    const pkgPath = path.join(PKG_ROOT, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      return pkg.version || VERSION;
    }
  } catch (e) {
    // Ignore error
  }
  return VERSION;
}

function printHeader() {
  const version = getPackageVersion();
  console.log(`${c.bold}${c.cyan}ag-sdd v${version}${c.reset} ${c.dim}— Spec-Driven Development for Anti-Gravity${c.reset}`);
  console.log('');
}

function printHelp() {
  printHeader();
  console.log(`${c.bold}USAGE${c.reset}`);
  console.log(`  ag-sdd <command> [options]`);
  console.log('');
  console.log(`${c.bold}COMMANDS${c.reset}`);
  console.log(`  ${c.green}init${c.reset}              Initialize ag-sdd in a target repository (scaffolds specs, rules, skills, agents, workflows, hooks)`);
  console.log(`  ${c.green}new <feature>${c.reset}     Create a new feature spec from templates`);
  console.log(`  ${c.green}status${c.reset}            Show task progress matrix across all feature specs`);
  console.log(`  ${c.green}next${c.reset}              Show the next executable task whose dependencies are satisfied`);
  console.log(`  ${c.green}start <feature> <task>${c.reset} Set a task to in-progress status [/]`);
  console.log(`  ${c.green}complete <feature> <task>${c.reset} Mark a task complete [x] and log implementation note`);
  console.log(`  ${c.green}active${c.reset}            Display currently active in-progress task & boundary`);
  console.log(`  ${c.green}reset <feature> <task>${c.reset} Reset a task back to pending status [ ]`);
  console.log(`  ${c.green}graph <feature>${c.reset}     Render Mermaid DAG flowchart of task dependencies`);
  console.log(`  ${c.green}linter <feature>${c.reset}    Audit spec quality against EARS syntax & task granularity floors`);
  console.log(`  ${c.green}verify${c.reset}            Validate spec files for structural compliance`);
  console.log(`  ${c.green}notes${c.reset}             Display accumulated implementation notes from tasks`);
  console.log(`  ${c.green}list${c.reset}              List all feature specs and their status`);
  console.log(`  ${c.green}help${c.reset}              Show this help message`);
  console.log('');
  console.log(`${c.bold}OPTIONS${c.reset}`);
  console.log(`  --force           Overwrite existing files (for init and new commands)`);
  console.log(`  --note "<text>"   Provide implementation note content for 'complete' command`);
  console.log('');
}

function showError(msg) {
  console.error(`\n${c.red}❌ ERROR:${c.reset} ${msg}\n`);
  process.exit(1);
}

function getArgs() {
  const args = process.argv.slice(2);
  const flags = { force: false, global: false, note: null };
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--force' || arg === '-f') {
      flags.force = true;
    } else if (arg === '--global' || arg === '-g') {
      flags.global = true;
    } else if (arg === '--note' || arg === '-n') {
      flags.note = args[i + 1] || '';
      i++;
    } else if (arg.startsWith('--note=')) {
      flags.note = arg.substring(7);
    } else if (arg.startsWith('-')) {
      // ignore other flags
    } else {
      positional.push(arg);
    }
  }

  return { command: positional[0] || 'help', args: positional.slice(1), flags };
}

function safeCopy(src, dest, force) {
  if (fs.existsSync(dest) && !force) {
    console.log(`  ${c.yellow}⚠️  Skipped${c.reset} ${dest} (already exists, use --force to overwrite)`);
    return false;
  }
  
  if (!fs.existsSync(src)) {
    console.log(`  ${c.red}❌ Missing source${c.reset} ${src}`);
    return false;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  ${c.green}✓ Created${c.reset} ${dest}`);
  return true;
}

function cmdInit(flags) {
  if (flags.global) {
    console.log(`${c.bold}Installing ag-sdd skill globally for Antigravity...${c.reset}\n`);
    const homeDir = os.homedir();
    const globalSkillsDir = path.join(homeDir, '.gemini', 'antigravity', 'skills', 'ag-sdd');
    const globalRulesDir = path.join(homeDir, '.gemini', 'config', 'rules');

    fs.mkdirSync(globalSkillsDir, { recursive: true });
    fs.mkdirSync(globalRulesDir, { recursive: true });

    // Copy SKILL.md and reference docs to global skills directory
    let srcSkillDir = path.join(PKG_ROOT, 'skills', 'ag-sdd');
    if (!fs.existsSync(srcSkillDir)) {
      srcSkillDir = path.join(PKG_ROOT, 'templates', 'skills', 'ag-sdd');
    }
    if (fs.existsSync(srcSkillDir)) {
      safeCopy(path.join(srcSkillDir, 'SKILL.md'), path.join(globalSkillsDir, 'SKILL.md'), flags.force);
      const srcRefs = path.join(srcSkillDir, 'references');
      if (fs.existsSync(srcRefs)) {
        const destRefs = path.join(globalSkillsDir, 'references');
        fs.mkdirSync(destRefs, { recursive: true });
        for (const file of fs.readdirSync(srcRefs)) {
          safeCopy(path.join(srcRefs, file), path.join(destRefs, file), flags.force);
        }
      }
    }

    // Copy global rule
    const srcRules = path.join(PKG_ROOT, 'rules', 'ag-sdd-rules.md');
    safeCopy(srcRules, path.join(globalRulesDir, 'ag-sdd-rules.md'), flags.force);

    console.log(`\n${c.cyan}✨ Global installation complete!${c.reset}`);
    console.log(`  The @ag-sdd skill is now available across all projects on your machine.`);
    return;
  }

  console.log(`${c.bold}Initializing ag-sdd in current repository...${c.reset}\n`);
  
  // Create .specs dir
  const specsDir = path.join(CWD, '.specs');
  if (!fs.existsSync(specsDir)) {
    fs.mkdirSync(specsDir, { recursive: true });
    console.log(`  ${c.green}✓ Created${c.reset} .specs/ directory`);
  } else {
    console.log(`  ${c.dim}✓ .specs/ directory already exists${c.reset}`);
  }

  // Copy AGENTS.md
  const srcAgents = path.join(PKG_ROOT, 'AGENTS.md');
  const destAgents = path.join(CWD, 'AGENTS.md');
  safeCopy(srcAgents, destAgents, flags.force);

  // Copy rules/ag-sdd-rules.md
  const srcRules = path.join(PKG_ROOT, 'rules', 'ag-sdd-rules.md');
  const destRules = path.join(CWD, 'rules', 'ag-sdd-rules.md');
  safeCopy(srcRules, destRules, flags.force);

  // Copy subagents to .agents/agents/
  const srcAgentsDir = path.join(PKG_ROOT, 'templates', 'agents');
  if (fs.existsSync(srcAgentsDir)) {
    const destAgentsDir = path.join(CWD, '.agents', 'agents');
    fs.mkdirSync(destAgentsDir, { recursive: true });
    for (const file of fs.readdirSync(srcAgentsDir)) {
      safeCopy(path.join(srcAgentsDir, file), path.join(destAgentsDir, file), flags.force);
    }
  }

  // Copy workflows to .agent/workflows/ (supports Antigravity slash commands /sdd-*)
  const srcWorkflowsDir = path.join(PKG_ROOT, 'templates', 'workflows');
  if (fs.existsSync(srcWorkflowsDir)) {
    const destWorkflowsDir = path.join(CWD, '.agent', 'workflows');
    fs.mkdirSync(destWorkflowsDir, { recursive: true });
    for (const file of fs.readdirSync(srcWorkflowsDir)) {
      safeCopy(path.join(srcWorkflowsDir, file), path.join(destWorkflowsDir, file), flags.force);
    }
  }

  // Copy boundary guard hook & hooks.json
  const srcHookScript = path.join(PKG_ROOT, 'hooks', 'boundary-guard.mjs');
  if (fs.existsSync(srcHookScript)) {
    safeCopy(srcHookScript, path.join(CWD, 'hooks', 'boundary-guard.mjs'), flags.force);
  }
  const srcHooksConfig = path.join(PKG_ROOT, 'templates', 'hooks.json');
  if (fs.existsSync(srcHooksConfig)) {
    safeCopy(srcHooksConfig, path.join(CWD, 'hooks.json'), flags.force);
  }

  // Copy plugin.json & skills.json
  const srcPluginJson = path.join(PKG_ROOT, 'plugin.json');
  if (fs.existsSync(srcPluginJson)) {
    safeCopy(srcPluginJson, path.join(CWD, 'plugin.json'), flags.force);
  }
  const srcSkillsJson = path.join(PKG_ROOT, 'skills.json');
  if (fs.existsSync(srcSkillsJson)) {
    safeCopy(srcSkillsJson, path.join(CWD, 'skills.json'), flags.force);
  }

  console.log(`\n${c.cyan}✨ Initialization complete. Next steps:${c.reset}`);
  console.log(`  1. Review AGENTS.md`);
  console.log(`  2. Type '@sdd-discovery <description>' or run 'ag-sdd new <feature-name>'`);
}

function cmdNew(args, flags) {
  const featureName = args[0];
  if (!featureName) {
    showError(`Please provide a feature name.\n\nUsage: ag-sdd new <feature-name>`);
  }

  const featureDir = path.join(CWD, '.specs', featureName);
  
  if (fs.existsSync(featureDir) && !flags.force) {
    showError(`Feature '${featureName}' already exists. Use --force to overwrite.`);
  }

  const templatesDir = path.join(PKG_ROOT, 'templates');
  if (!fs.existsSync(templatesDir)) {
    showError(`Templates directory not found at ${templatesDir}`);
  }

  fs.mkdirSync(featureDir, { recursive: true });
  console.log(`${c.bold}Creating new feature spec: ${c.cyan}${featureName}${c.reset}\n`);

  const files = fs.readdirSync(templatesDir);
  let copied = 0;

  for (const file of files) {
    const srcPath = path.join(templatesDir, file);
    const destPath = path.join(featureDir, file);
    
    if (fs.statSync(srcPath).isFile()) {
      const content = fs.readFileSync(srcPath, 'utf8');
      const replaced = content.replace(/\{\{FEATURE_NAME\}\}/g, featureName);
      fs.writeFileSync(destPath, replaced);
      console.log(`  ${c.green}✓ Created${c.reset} .specs/${featureName}/${file}`);
      copied++;
    }
  }

  if (copied === 0) {
    console.log(`  ${c.yellow}⚠️  No templates found in ${templatesDir}${c.reset}`);
  }

  console.log(`\n${c.cyan}✨ Feature '${featureName}' created. Open .specs/${featureName}/ to edit.${c.reset}`);
}

function parseTasks(content) {
  const tasks = [];
  const lines = content.split('\n');
  let currentTask = null;
  
  // Stop parsing tasks when we hit ## Implementation Notes
  const notesIdx = content.indexOf('## Implementation Notes');
  const taskContent = notesIdx >= 0 ? content.substring(0, notesIdx) : content;
  const taskLines = taskContent.split('\n');
  
  for (const line of taskLines) {
    const taskMatch = line.match(/^\s*- \[([\s xX\/])\] \*\*(.+?)\*\*/);
    if (taskMatch) {
      const status = taskMatch[1].trim().toLowerCase();
      currentTask = {
        done: status === 'x',
        inProgress: status === '/',
        title: taskMatch[2].trim(),
        rawLine: line,
        depends: [],
        boundary: null,
        verification: null,
        action: null,
        context: null,
        execution: null,
      };
      tasks.push(currentTask);
    } else if (currentTask) {
      const dependsMatch = line.match(/_Depends:_\s*(.+)/);
      if (dependsMatch) {
        const raw = dependsMatch[1].trim();
        // Handle `None`, `none`, or empty
        if (/^`?none`?$/i.test(raw) || raw === '') {
          currentTask.depends = [];
        } else {
          // Split by comma, strip backticks and whitespace
          currentTask.depends = raw.split(',').map(d => d.trim().replace(/`/g, '')).filter(Boolean);
        }
      }
      
      const boundaryMatch = line.match(/_Boundary:_\s*(.+)/);
      if (boundaryMatch) {
        currentTask.boundary = boundaryMatch[1].trim();
      }

      const verifyMatch = line.match(/_Verification:_\s*(.+)/);
      if (verifyMatch) {
        currentTask.verification = verifyMatch[1].trim().replace(/`/g, '');
      }

      const actionMatch = line.match(/_Action:_\s*(.+)/);
      if (actionMatch) currentTask.action = actionMatch[1].trim();

      const contextMatch = line.match(/_Context:_\s*(.+)/);
      if (contextMatch) currentTask.context = contextMatch[1].trim();

      const executionMatch = line.match(/_Execution:_\s*(.+)/);
      if (executionMatch) currentTask.execution = executionMatch[1].trim();
    }
  }
  return tasks;
}

function parseMetadata(content) {
  const meta = { featureName: null, scope: null, estimatedTasks: null };
  const scopeMatch = content.match(/\*\*Scope Category:\*\*\s*(.+)/);
  if (scopeMatch) meta.scope = scopeMatch[1].trim().replace(/<!--.*?-->/, '').trim().toLowerCase();
  const countMatch = content.match(/\*\*Estimated Task Count:\*\*\s*(\d+)/);
  if (countMatch) meta.estimatedTasks = parseInt(countMatch[1], 10);
  return meta;
}

function getFeatures() {
  const specsDir = path.join(CWD, '.specs');
  if (!fs.existsSync(specsDir)) {
    return [];
  }
  return fs.readdirSync(specsDir).filter(f => fs.statSync(path.join(specsDir, f)).isDirectory());
}

function cmdStatus() {
  const features = getFeatures();
  if (features.length === 0) {
    console.log(`${c.yellow}No features found in .specs/ directory.${c.reset}`);
    return;
  }

  console.log(`${c.bold}📋 Feature Task Status${c.reset}\n`);
  
  // Table header
  console.log(`  ${c.dim}┌────────────────────────────┬───────┬──────┬─────────┬───────────┬─────────┐${c.reset}`);
  console.log(`  ${c.dim}│${c.reset} ${c.bold}Feature${c.reset}${' '.repeat(20)} ${c.dim}│${c.reset} ${c.bold}Total${c.reset} ${c.dim}│${c.reset} ${c.bold}Done${c.reset} ${c.dim}│${c.reset} ${c.bold}In Prog${c.reset} ${c.dim}│${c.reset} ${c.bold}Remaining${c.reset} ${c.dim}│${c.reset} ${c.bold}% Compl${c.reset} ${c.dim}│${c.reset}`);
  console.log(`  ${c.dim}├────────────────────────────┼───────┼──────┼─────────┼───────────┼─────────┤${c.reset}`);

  let totalTasks = 0;
  let totalDone = 0;

  for (const feature of features) {
    const tasksFile = path.join(CWD, '.specs', feature, '03_tasks.md');
    let done = 0;
    let total = 0;
    let inProgress = 0;

    if (fs.existsSync(tasksFile)) {
      const content = fs.readFileSync(tasksFile, 'utf8');
      const tasks = parseTasks(content);
      total = tasks.length;
      done = tasks.filter(t => t.done).length;
      
      // Basic heuristic: if some dependencies are done but not the task itself, it might be in progress
      // But for simplicity, we'll just consider tasks with '●' or if any task is checked it's partially done.
      // We'll leave inProgress as 0 unless we parse a specific symbol.
      // We'll stick to remaining = total - done
    }

    const remaining = total - done;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    
    totalTasks += total;
    totalDone += done;

    const fName = feature.length > 26 ? feature.substring(0, 24) + '..' : feature;
    console.log(`  ${c.dim}│${c.reset} ${c.cyan}${fName.padEnd(26)}${c.reset} ${c.dim}│${c.reset} ${total.toString().padEnd(5)} ${c.dim}│${c.reset} ${done.toString().padEnd(4)} ${c.dim}│${c.reset} ${inProgress.toString().padEnd(7)} ${c.dim}│${c.reset} ${remaining.toString().padEnd(9)} ${c.dim}│${c.reset} ${(percent + '%').padEnd(7)} ${c.dim}│${c.reset}`);
  }
  
  console.log(`  ${c.dim}└────────────────────────────┴───────┴──────┴─────────┴───────────┴─────────┘${c.reset}`);
  
  console.log('');
  const overallPercent = totalTasks === 0 ? 0 : Math.round((totalDone / totalTasks) * 100);
  console.log(`${c.bold}Overall Summary:${c.reset} ${totalDone}/${totalTasks} tasks complete (${overallPercent}%)`);
}

function cmdNext() {
  const features = getFeatures();
  if (features.length === 0) {
    console.log(`${c.yellow}No features found.${c.reset}`);
    return;
  }

  let foundNext = false;
  console.log(`${c.bold}🔍 Next Executable Tasks${c.reset}\n`);

  for (const feature of features) {
    const tasksFile = path.join(CWD, '.specs', feature, '03_tasks.md');
    if (!fs.existsSync(tasksFile)) continue;
    
    const content = fs.readFileSync(tasksFile, 'utf8');
    const tasks = parseTasks(content);
    
    // Build a set of completed task identifiers for dependency resolution
    const doneTitles = new Set();
    for (const t of tasks) {
      if (t.done) {
        doneTitles.add(t.title);
        // Also extract "Task N" identifiers e.g. "Task 1: Setup" -> "Task 1"
        const idMatch = t.title.match(/^(Task\s+\d+)/i);
        if (idMatch) doneTitles.add(idMatch[1]);
      }
    }
    
    // Find the first task that is not done, and whose dependencies are ALL satisfied
    for (const task of tasks) {
      if (task.done || task.inProgress) continue;
      
      let depsSatisfied = true;
      if (task.depends.length > 0) {
        depsSatisfied = task.depends.every(dep => {
          // Check if any done task title contains/matches this dependency
          for (const doneTitle of doneTitles) {
            if (doneTitle.toLowerCase().includes(dep.toLowerCase()) || dep.toLowerCase().includes(doneTitle.toLowerCase())) {
              return true;
            }
          }
          return false;
        });
      }
      
      if (depsSatisfied) {
        foundNext = true;
        console.log(`  ${c.cyan}Feature:${c.reset} ${c.bold}${feature}${c.reset}`);
        console.log(`  ${c.yellow}Task:${c.reset}    ${task.title}`);
        if (task.action) {
          console.log(`  ${c.dim}Action:${c.reset}  ${task.action}`);
        }
        if (task.boundary) {
          console.log(`  ${c.dim}Boundary:${c.reset} ${task.boundary}`);
        }
        if (task.depends.length > 0) {
          console.log(`  ${c.dim}Depends:${c.reset} ${task.depends.join(', ')}`);
        }
        if (task.verification) {
          console.log(`  ${c.dim}Verify:${c.reset}  ${task.verification}`);
        }
        console.log('');
        break; // Only show one next task per feature
      }
    }
  }

  if (!foundNext) {
    console.log(`  ${c.green}🎉 All tasks complete or no executable tasks found!${c.reset}`);
  }
}

function cmdVerify() {
  const features = getFeatures();
  if (features.length === 0) {
    console.log(`${c.yellow}No features found.${c.reset}`);
    return;
  }

  console.log(`${c.bold}🔬 Verifying Specs${c.reset}\n`);
  
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const feature of features) {
    console.log(`  ${c.cyan}${feature}${c.reset}`);
    const featureDir = path.join(CWD, '.specs', feature);
    let featureOk = true;
    
    // 1. Check required files exist
    const requiredFiles = ['01_requirements.md', '02_design.md', '03_tasks.md'];
    for (const file of requiredFiles) {
      const filePath = path.join(featureDir, file);
      if (!fs.existsSync(filePath)) {
        console.log(`    ${c.red}❌ Missing ${file}${c.reset}`);
        totalErrors++;
        featureOk = false;
      } else {
        console.log(`    ${c.green}✓${c.reset} ${file}`);
      }
    }

    // 2. Validate 03_tasks.md structure
    const tasksPath = path.join(featureDir, '03_tasks.md');
    if (fs.existsSync(tasksPath)) {
      const content = fs.readFileSync(tasksPath, 'utf8');
      const tasks = parseTasks(content);
      const meta = parseMetadata(content);
      
      if (tasks.length === 0) {
        console.log(`    ${c.yellow}⚠️  No tasks found in 03_tasks.md${c.reset}`);
        totalWarnings++;
      } else {
        // Check boundary and depends metadata
        let missingBoundary = 0;
        let missingVerification = 0;
        for (const task of tasks) {
          if (!task.boundary) missingBoundary++;
          if (!task.verification) missingVerification++;
        }
        if (missingBoundary > 0) {
          console.log(`    ${c.red}❌ ${missingBoundary} task(s) missing _Boundary:_ metadata${c.reset}`);
          totalErrors++;
        }
        if (missingVerification > 0) {
          console.log(`    ${c.yellow}⚠️  ${missingVerification} task(s) missing _Verification:_ command${c.reset}`);
          totalWarnings++;
        }

        // 3. Granularity floor check
        const granularityFloors = {
          'small fix': 5, 'small': 5, 'bug fix': 5,
          'medium feature': 15, 'medium': 15,
          'large feature': 30, 'large': 30, 'full app': 30, 'large feature / full app': 30,
        };

        if (meta.scope) {
          const minTasks = granularityFloors[meta.scope];
          if (minTasks && tasks.length < minTasks) {
            console.log(`    ${c.red}❌ Granularity violation: scope "${meta.scope}" requires ≥${minTasks} tasks, found ${tasks.length}${c.reset}`);
            totalErrors++;
          } else if (minTasks) {
            console.log(`    ${c.green}✓${c.reset} Granularity: ${tasks.length} tasks (min ${minTasks} for "${meta.scope}")`);
          }
        }

        // 4. Check for circular dependencies (basic)
        const taskIds = new Set(tasks.map((_, i) => `Task ${i + 1}`));
        for (const task of tasks) {
          for (const dep of task.depends) {
            const depNorm = dep.trim();
            // Check if dependency references a task that exists
            const found = tasks.some(t => t.title.toLowerCase().includes(depNorm.toLowerCase()));
            if (!found && depNorm !== '') {
              console.log(`    ${c.yellow}⚠️  Task "${task.title}" depends on "${depNorm}" which was not found${c.reset}`);
              totalWarnings++;
            }
          }
        }
      }
    }
    console.log('');
  }

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log(`  ${c.green}✅ All specs structurally compliant!${c.reset}`);
  } else if (totalErrors === 0) {
    console.log(`  ${c.yellow}⚠️  ${totalWarnings} warning(s), no errors.${c.reset}`);
  } else {
    console.log(`  ${c.red}❌ ${totalErrors} error(s), ${totalWarnings} warning(s).${c.reset}`);
    process.exitCode = 1;
  }
}

function cmdNotes() {
  const features = getFeatures();
  if (features.length === 0) {
    console.log(`${c.yellow}No features found.${c.reset}`);
    return;
  }

  console.log(`${c.bold}📝 Implementation Notes${c.reset}\n`);
  let foundNotes = false;

  for (const feature of features) {
    const tasksFile = path.join(CWD, '.specs', feature, '03_tasks.md');
    if (!fs.existsSync(tasksFile)) continue;
    
    const content = fs.readFileSync(tasksFile, 'utf8');
    const notesMatch = content.match(/## Implementation Notes\s+([\s\S]*)/);
    
    if (notesMatch && notesMatch[1].trim().length > 0) {
      const notes = notesMatch[1].trim();
      // Strip HTML comments and check if anything meaningful remains
      const stripped = notes.replace(/<!--[\s\S]*?-->/g, '').trim();
      if (stripped.length === 0) continue; // Only template boilerplate, skip
      
      foundNotes = true;
      console.log(`  ${c.cyan}=== ${feature} ===${c.reset}`);
      console.log(stripped.split('\n').map(line => `  ${line}`).join('\n'));
      console.log('');
    }
  }

  if (!foundNotes) {
    console.log(`  ${c.dim}No implementation notes found.${c.reset}`);
  }
}

function updateTaskStatus(feature, taskSelector, newStatus, note = null) {
  const tasksFile = path.join(CWD, '.specs', feature, '03_tasks.md');
  if (!fs.existsSync(tasksFile)) {
    showError(`Feature tasks file not found: .specs/${feature}/03_tasks.md`);
  }

  let content = fs.readFileSync(tasksFile, 'utf8');
  const tasks = parseTasks(content);

  if (tasks.length === 0) {
    showError(`No tasks found in .specs/${feature}/03_tasks.md`);
  }

  // Find target task by index (e.g. 1) or title search
  let targetTask = null;
  const num = parseInt(taskSelector, 10);
  if (!isNaN(num) && num > 0 && num <= tasks.length) {
    targetTask = tasks[num - 1];
  } else {
    targetTask = tasks.find(t => t.title.toLowerCase().includes(taskSelector.toLowerCase()));
  }

  if (!targetTask) {
    showError(`Task "${taskSelector}" not found in .specs/${feature}/03_tasks.md`);
  }

  // Symbol replacement: [ ] or [/] or [x]
  const oldSymbolMatch = targetTask.rawLine.match(/\[([\s xX\/])\]/);
  if (!oldSymbolMatch) {
    showError(`Could not parse task checkbox symbol in line: ${targetTask.rawLine}`);
  }

  const updatedLine = targetTask.rawLine.replace(/\[([\s xX\/])\]/, `[${newStatus}]`);
  content = content.replace(targetTask.rawLine, updatedLine);

  // If note provided for completed task, append to ## Implementation Notes
  if (newStatus === 'x' && note) {
    const timestamp = new Date().toISOString();
    const noteEntry = `\n### ${targetTask.title} — Notes\n- **Completed:** ${timestamp}\n- **Learnings & Decisions:** ${note}\n`;
    
    if (content.includes('## Implementation Notes')) {
      content = content + `\n${noteEntry}`;
    } else {
      content = content + `\n\n## Implementation Notes\n${noteEntry}`;
    }
  }

  fs.writeFileSync(tasksFile, content, 'utf8');
  return targetTask;
}

function cmdStart(args) {
  const feature = args[0];
  const taskSel = args[1];
  if (!feature || !taskSel) {
    showError(`Usage: ag-sdd start <feature-name> <task-number-or-title>`);
  }
  const task = updateTaskStatus(feature, taskSel, '/');
  console.log(`  ${c.yellow}● Started task${c.reset} [${feature}]: "${task.title}"`);
  if (task.boundary) {
    console.log(`  ${c.dim}Boundary:${c.reset} ${task.boundary}`);
  }
}

function cmdComplete(args, flags) {
  const feature = args[0];
  const taskSel = args[1];
  if (!feature || !taskSel) {
    showError(`Usage: ag-sdd complete <feature-name> <task-number-or-title> [--note "Learnings"]`);
  }
  const task = updateTaskStatus(feature, taskSel, 'x', flags.note);
  console.log(`  ${c.green}✓ Completed task${c.reset} [${feature}]: "${task.title}"`);
}

function cmdReset(args) {
  const feature = args[0];
  const taskSel = args[1];
  if (!feature || !taskSel) {
    showError(`Usage: ag-sdd reset <feature-name> <task-number-or-title>`);
  }
  const task = updateTaskStatus(feature, taskSel, ' ');
  console.log(`  ${c.dim}↺ Reset task to pending${c.reset} [${feature}]: "${task.title}"`);
}

function cmdActive() {
  const features = getFeatures();
  if (features.length === 0) {
    console.log(`${c.yellow}No features found.${c.reset}`);
    return;
  }

  console.log(`${c.bold}⚡ Active Tasks${c.reset}\n`);
  let foundActive = false;

  for (const feature of features) {
    const tasksFile = path.join(CWD, '.specs', feature, '03_tasks.md');
    if (!fs.existsSync(tasksFile)) continue;

    const content = fs.readFileSync(tasksFile, 'utf8');
    const tasks = parseTasks(content);
    const inProg = tasks.filter(t => t.inProgress);

    for (const task of inProg) {
      foundActive = true;
      console.log(`  ${c.cyan}Feature:${c.reset} ${c.bold}${feature}${c.reset}`);
      console.log(`  ${c.yellow}Active Task:${c.reset} ${task.title}`);
      if (task.action) console.log(`  ${c.dim}Action:${c.reset}     ${task.action}`);
      if (task.boundary) console.log(`  ${c.dim}Boundary:${c.reset}   ${task.boundary}`);
      if (task.verification) console.log(`  ${c.dim}Verify:${c.reset}     ${task.verification}`);
      console.log('');
    }
  }

  if (!foundActive) {
    console.log(`  ${c.dim}No active (in-progress [/]) tasks. Run 'ag-sdd next' to find work.${c.reset}`);
  }
}

function cmdGraph(args) {
  const feature = args[0];
  if (!feature) {
    showError(`Usage: ag-sdd graph <feature-name>`);
  }

  const tasksFile = path.join(CWD, '.specs', feature, '03_tasks.md');
  if (!fs.existsSync(tasksFile)) {
    showError(`Feature tasks file not found: .specs/${feature}/03_tasks.md`);
  }

  const content = fs.readFileSync(tasksFile, 'utf8');
  const tasks = parseTasks(content);

  console.log(`${c.bold}📊 Mermaid Dependency Graph for [${c.cyan}${feature}${c.reset}${c.bold}]${c.reset}\n`);
  console.log('```mermaid');
  console.log('graph TD');

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const taskId = `T${i + 1}`;
    const cleanTitle = task.title.replace(/"/g, "'");
    const shape = task.done ? `(("${cleanTitle}"))` : task.inProgress ? `> "${cleanTitle}" ]` : `[ "${cleanTitle}" ]`;
    console.log(`    ${taskId}${shape}`);

    for (const dep of task.depends) {
      const depIdx = tasks.findIndex(t => t.title.toLowerCase().includes(dep.toLowerCase()));
      if (depIdx >= 0) {
        console.log(`    T${depIdx + 1} --> ${taskId}`);
      }
    }
  }
  console.log('```\n');
}

function cmdLinter(args) {
  const feature = args[0];
  if (!feature) {
    showError(`Usage: ag-sdd linter <feature-name>`);
  }

  const featureDir = path.join(CWD, '.specs', feature);
  if (!fs.existsSync(featureDir)) {
    showError(`Feature not found: .specs/${feature}`);
  }

  console.log(`${c.bold}🔍 Linting Spec Quality: ${c.cyan}${feature}${c.reset}\n`);
  let issues = 0;

  // 1. Check requirements EARS syntax
  const reqFile = path.join(featureDir, '01_requirements.md');
  if (fs.existsSync(reqFile)) {
    const reqContent = fs.readFileSync(reqFile, 'utf8');
    const earsKeywords = ['shall', 'when', 'while', 'where', 'if'];
    let earsCount = 0;
    for (const kw of earsKeywords) {
      const matches = reqContent.match(new RegExp(`\\b${kw}\\b`, 'gi'));
      if (matches) earsCount += matches.length;
    }
    if (earsCount < 3) {
      console.log(`  ${c.yellow}⚠️  01_requirements.md has weak EARS syntax usage (found ${earsCount} clauses)${c.reset}`);
      issues++;
    } else {
      console.log(`  ${c.green}✓${c.reset} EARS Syntax: ${earsCount} clauses detected`);
    }
  }

  // 2. Check 02_design.md Mermaid diagrams
  const desFile = path.join(featureDir, '02_design.md');
  if (fs.existsSync(desFile)) {
    const desContent = fs.readFileSync(desFile, 'utf8');
    const mermaidBlocks = desContent.match(/```mermaid/g);
    if (!mermaidBlocks || mermaidBlocks.length === 0) {
      console.log(`  ${c.yellow}⚠️  02_design.md is missing Mermaid diagrams${c.reset}`);
      issues++;
    } else {
      console.log(`  ${c.green}✓${c.reset} Design Diagrams: ${mermaidBlocks.length} Mermaid block(s) found`);
    }
  }

  // 3. Check 03_tasks.md task count floor and fields
  const tasksFile = path.join(featureDir, '03_tasks.md');
  if (fs.existsSync(tasksFile)) {
    const tasksContent = fs.readFileSync(tasksFile, 'utf8');
    const tasks = parseTasks(tasksContent);
    const meta = parseMetadata(tasksContent);

    console.log(`  ${c.green}✓${c.reset} Task Count: ${tasks.length} tasks defined`);

    let missingActions = 0;
    let missingBoundaries = 0;
    let missingVerifications = 0;

    for (const task of tasks) {
      if (!task.action) missingActions++;
      if (!task.boundary) missingBoundaries++;
      if (!task.verification) missingVerifications++;
    }

    if (missingActions > 0 || missingBoundaries > 0 || missingVerifications > 0) {
      console.log(`  ${c.red}❌ Task Field Completeness: ${missingActions} missing Action, ${missingBoundaries} missing Boundary, ${missingVerifications} missing Verification${c.reset}`);
      issues++;
    } else {
      console.log(`  ${c.green}✓${c.reset} Task Completeness: All A-C-E fields & boundaries populated`);
    }
  }

  console.log('');
  if (issues === 0) {
    console.log(`  ${c.green}✅ Spec quality lint passed cleanly!${c.reset}`);
  } else {
    console.log(`  ${c.yellow}⚠️  Found ${issues} quality advisory issue(s).${c.reset}`);
  }
}

function cmdList() {
  const features = getFeatures();
  if (features.length === 0) {
    console.log(`${c.yellow}No features found.${c.reset}`);
    return;
  }

  console.log(`${c.bold}📋 Feature Specs${c.reset}\n`);

  for (const feature of features) {
    const featureDir = path.join(CWD, '.specs', feature);
    
    const hasReq = fs.existsSync(path.join(featureDir, '01_requirements.md'));
    const hasDes = fs.existsSync(path.join(featureDir, '02_design.md'));
    const hasTas = fs.existsSync(path.join(featureDir, '03_tasks.md'));
    const hasSign = fs.existsSync(path.join(featureDir, '04_signoff.md'));

    const statusStr = [
      hasReq ? `${c.green}Req${c.reset}` : `${c.red}Req${c.reset}`,
      hasDes ? `${c.green}Des${c.reset}` : `${c.red}Des${c.reset}`,
      hasTas ? `${c.green}Tas${c.reset}` : `${c.red}Tas${c.reset}`,
      hasSign ? `${c.green}Sig${c.reset}` : `${c.red}Sig${c.reset}`
    ].join(' ');

    console.log(`  ${c.cyan}• ${feature.padEnd(20)}${c.reset} [${statusStr}]`);
  }
}

async function main() {
  const { command, args, flags } = getArgs();

  try {
    switch (command) {
      case 'init':
        cmdInit(flags);
        break;
      case 'new':
        cmdNew(args, flags);
        break;
      case 'status':
        cmdStatus();
        break;
      case 'next':
        cmdNext();
        break;
      case 'start':
        cmdStart(args);
        break;
      case 'complete':
        cmdComplete(args, flags);
        break;
      case 'active':
        cmdActive();
        break;
      case 'reset':
        cmdReset(args);
        break;
      case 'graph':
        cmdGraph(args);
        break;
      case 'linter':
        cmdLinter(args);
        break;
      case 'verify':
        cmdVerify();
        break;
      case 'notes':
        cmdNotes();
        break;
      case 'list':
        cmdList();
        break;
      case 'help':
        printHelp();
        break;
      default:
        console.error(`${c.red}❌ Unknown command: ${command}${c.reset}\n`);
        printHelp();
        process.exit(1);
    }
  } catch (err) {
    showError(err.message);
  }
}

main();
