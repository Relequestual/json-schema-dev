---
name: planning-first-development
description: 'Checkpoint-driven development methodology where planning documents are the source of truth. Use when starting features, moving between phases, making architecture decisions, or managing multi-phase projects with explicit planning. Covers when to check planning docs, checkpoint processes, phased progress tracking, and preventing misdirected implementation.'
---

# Planning-First Development

A checkpoint-driven development methodology where planning documents serve as the source of truth for project direction, and AI agents check high-level plans before implementing features or making architecture decisions.

**Ideal for**: Multi-phase projects with explicit planning documentation and phased deliverables. Works across all tech stacks and project types.

---

## Core Principles

### 1. Planning Documents Are Source of Truth

Before starting significant work, check the planning documentation first:

**Always check planning when:**

- Starting work on a new feature or component
- Moving between project phases
- Implementing architecture-level changes
- Questions arise about project status or priorities
- Making decisions that impact multiple components

**Don't check planning for:**

- Routine bug fixes with clear scope
- Minor code style or local refactoring
- Single-file isolated changes
- Clarification about existing, narrow implementations

**Example**: Implementing a new API endpoint? Check planning first to see if it's in the roadmap and understand phase dependencies. Fixing a typo in a component? Just fix it.

### 2. Checkpoint-Driven Progress

Development happens in explicit phases with reviews between them:

- **Plan → Implement → Mark Complete** (not "plan and run all phases invisibly")
- Stop and review before moving to next major phase
- Update progress explicitly (don't assume tasks are done)
- Document what was learned for future phases

**Example**: Phase 1 completes—pause, verify deliverables against plan, get feedback. Then start Phase 2. Don't implement Phase 2 while Phase 1 is uncertain.

### 3. Explicit Task Tracking

Use status indicators to show progress transparently:

- ✅ Complete — task finished, verified against plan
- 🔄 In Progress — currently working, not assuming completion
- [no icon] Not Started — planned but not begun

Never batch completions. Mark tasks complete as they finish. This helps others (and future you) track momentum and blockers.

---

## When to Reference Planning vs. Implement

| Situation                       | Action                                  |
| ------------------------------- | --------------------------------------- |
| New feature requested           | Check planning; confirm it's in roadmap |
| Feature exists, needs extension | Check planning for phase status         |
| Edge case in existing feature   | Implement directly (in-scope fix)       |
| Performance issue in known code | Implement directly (bug fix)            |
| Architectural decision needed   | Check planning for approach decisions   |
| Moving between phases           | Stop and review planning + deliverables |

---

## Checkpoint Process

**Phases transition like this:**

1. **Plan Phase N** → Document features, architecture, dependencies
2. **Implement Phase N** → Build features, mark tasks complete as they finish
3. **Review** → Verify all deliverables are complete, check against planning
4. **Decide** → Proceed to Phase N+1 or iterate Phase N
5. **Begin Phase N+1** → Check planning for new phase scope, start work

**What Not to Do**: Implement Phase 2 while Phase 1 is uncertain. Plan Phase 3 while Phase 1 is halfway done. Give task status "maybe done" — verify and mark properly.

---

## Generic Project Example

A web app project with three phases:

```
Phase 1: Foundation
├── Set up build/deploy ✅
├── Create base components ✅
├── Wire state management 🔄
└── [checkpoint before Phase 2]

Phase 2: Features
├── Implement user auth
├── Add data validation
└── [checkpoint before Phase 3]

Phase 3: Polish
├── Performance optimization
├── Error handling enhancement
└── [release ready]
```

When you reach the checkpoint between Phase 1 and 2, you pause, verify "state management works," then officially start Phase 2. You don't assume it's done.

---

## Why This Matters for AI Agents

- **Avoids misdirection**: Plans might say "implement this in Phase 3, not Phase 1." Without checking, you waste effort.
- **Respects explicit status**: If plan says "Phase 2 complete," don't re-implement Phase 2 features in Phase 3.
- **Enables transparency**: Others can see what was done vs. what's planned; clear communication.
- **Supports handoffs**: New people/agents can understand project direction instantly from planning docs.

---

## Anti-Patterns to Avoid

❌ **Implementing all phases invisibly** — Plan says "do later," you do it now anyway
❌ **Assuming tasks are complete** — "Looks done to me" vs. "verified against plan"
❌ **Skipping checkpoints** — Moving to Phase 2 while Phase 1 status is unclear
❌ **Changing architectural decisions mid-phase** — Plan says "use Pinia," you switch to other store
❌ **Parallel phases** — Building Phase 2 while Phase 1's foundation is still shaky

---

## For Multi-Agent / Team Environments

- **Each agent checks planning independently** — No hidden decisions
- **Status updates are explicit** — Use checkmarks and progress markers
- **Handoff is planning-driven** — Next person reads planning, understands context
- **Disputes resolved by planning** — "Plan says feature X belongs in Phase 3" is authoritative

---

## Related Documentation

See your project's planning directory structure for:

- `planning.md` — High-level strategy and phase definitions
- `current-tasks.md` — Actionable items within current phase
- `decisions/` — Architecture decisions and their rationale
