---
name: planning-doc-practices
description: 'Guidelines for safely modifying planning and requirements documentation during development. Use when updating docs, removing sections, consolidating features, or distinguishing feature tracking from implementation details. Prevents loss of critical context through careless documentation rewrites. Covers enhancement vs. removal heuristics, when to ask before modifying, and the planning vs. implementation distinction.'
---

# Planning Doc Practices

Guidelines for safely modifying planning and requirements documentation during active development. Distinguishes between feature tracking (persistent) and implementation details (transient), preventing loss of critical context through careless documentation updates.

**Essential for**: Any project with planning/requirements docs that track what users need vs. how it's built. Prevents AI (and humans) from "helpfully" reorganizing away important constraints.

---

## Core Principle

**Planning docs track WHAT users need.
Implementation docs track HOW we build it.**

When they get mixed up, you lose critical context about requirements and dependencies.

---

## The Rule: Enhance, Don't Replace

### DO: Enhance Planning Documentation ✅

**Add to planning docs:**

- Status indicators (✅, 🔄) showing implementation progress
- New sections for discovered features or constraints
- Cross-references to related decisions or implementations
- Clarifications refining original requirements
- Implementation details needed for future phases

**Examples:**

- ✅ Adding "✅ Implemented in Phase 2" to a feature list
- ✅ Adding new subsection "Edge Cases Discovered" with refinements
- ✅ Adding status indicator to show "this decision was made Aug 5, 2025"
- ✅ Adding "See implementation/ for current code location" pointers

### DON'T: Remove or Rewrite Planning Sections ❌

**Don't remove from planning docs without asking:**

- Feature lists or requirements sections ("we implemented this, delete it")
- "Completed" items or phases (you might need to verify feature parity later)
- Decision rationale or alternatives considered ("this is outdated")
- User-facing functionality tracking ("nobody uses this anyway")
- Constraints or limitations ("problem solved, forget the context")

**Examples of things to ASK about first:**

- ❌ "Can I consolidate these three requirements sections into one?"
- ❌ "Can I delete the 'completed features' section to clean up?"
- ❌ "Can I rewrite the Phase 1 section since it's old?"
- ❌ "Can I remove unused feature ideas from the 'future' section?"

---

## How to Distinguish: 3-Question Test

**Is this planning or implementation detail?**

### Question 1: Does it track what users need?

- "Add user authentication" → **Planning** (what the user needs)
- "Use OAuth2 library X" → **Implementation** (how we do it)
- "API must validate JSON Schema" → **Planning** (requirement)
- "Validation uses AJV v8.17.1" → **Implementation** (technical choice)

### Question 2: Would someone need this for future feature parity checks?

- ✅ **Keep**: "Core features: JSON validation, schema editing, shareable URLs"
- ❌ **Can remove**: "Used CodeMirror v5.0 in old app" (implementation artifact)
- ✅ **Keep**: "Must preserve backward compatibility with existing shared URLs"
- ❌ **Can remove**: "Temporary hack: if (date < Aug 9) use legacy code"

### Question 3: Does removing it lose decision context?

- ✅ **Keep**: "Decision: Use Cloudflare D1 for storage (evaluated KV, R2, Durable Objects)"
- ❌ **Can remove**: "Tried approach A, it was slow, now using B"
- ✅ **Keep**: "Known limitation: File uploads max 10MB (Cloudflare limit)"
- ❌ **Can remove**: "Bug fixed in v1.2 (already deployed)"

---

## Decision Framework: When to Ask

| Modification                                                | Ask First?                             | Why                                |
| ----------------------------------------------------------- | -------------------------------------- | ---------------------------------- |
| Add ✅ status to completed item                             | No                                     | Adding info, not removing          |
| Add new feature section discovered during implementation    | No                                     | Expanding planning docs            |
| Delete "completed" features section to clean up             | **Yes**                                | Removes tracking info              |
| Rewrite Phase N section for clarity                         | **Maybe** — Ask if it removes sections | Rewrites might lose context        |
| Consolidate three similar requirements into one             | **Yes**                                | Might mask nuances                 |
| Add "See decisions/X.md for rationale"                      | No                                     | Adding cross-reference             |
| Remove old decision alternatives ("we rejected approach X") | **Yes**                                | Why was X rejected? Future context |
| Fix typos in planning docs                                  | No                                     | Maintenance, not removal           |

---

## Practical Scenarios

### Scenario 1: Feature Completion

**Situation**: Phase 2 says "Implement Monaco Editor Integration" but it's done.
**Correct Action** ✅: Add ✅ to the item and maybe "Completed: Aug 15, 2025"
**Wrong Action** ❌: Delete the item from planning docs

**Why**: Future developer might ask "were editors planned? does legacy app have editors?" Answer is in planning docs.

### Scenario 2: Discovered Edge Case

**Situation**: Planning doc says "Support file uploads." During implementation, you discover 10MB limit from Cloudflare.
**Correct Action** ✅: Add new subsection "Known Constraints" with the limit and source
**Wrong Action** ❌: Rewrite "Support file uploads" to "Support file uploads, max 10MB" (loses "why this exists" context)

**Why**: A new implementer might see "max 10MB" and think it's a choice, not a platform limit.

### Scenario 3: Consolidating Sections

**Situation**: Planning has three sections: "User Auth," "OAuth Setup," "Session Mgmt"
**Correct Action** ✅: Ask first: "These look related, can I consolidate?" (They might be distinct phases)
**Wrong Action** ❌: Consolidate without asking (might hide phase dependencies)

### Scenario 4: Removing Old Decisions

**Situation**: Decision doc says "Evaluated Vue 2, Vue 3, and Nuxt. Chose Nuxt." But you're already using Nuxt.
**Correct Action** ✅: Keep it, maybe add "✅ Implemented: Nuxt 4"
**Wrong Action** ❌: Delete "Evaluated Vue 2 and Vue 3" parts (future person loses context about why Vue 2 wasn't chosen)

---

## Red Flags: When to Pause and Ask

🚩 "This section is redundant, I can clean it up"
🚩 "This feature was completed, we don't need to track it"
🚩 "This decision is old, let's remove the rejected alternatives"
🚩 "This section says 'to be determined,' nobody filled it in, I should delete it"

**Better question**: "Should I enhance this with status/details, or is it safe to remove?"

---

## Enhancement Examples (Do These)

**Before** (planning doc, Phase 2):

```
- Implement JSON Schema validation
- Create validation results display
- Add real-time validation feedback
```

**After** (enhanced):

```
- ✅ Implement JSON Schema validation (AJV 8.17.1, see implementation.md)
- ✅ Create validation results display (Results.vue component)
- ✅ Add real-time validation feedback (Debounced via XState machine)
- Note: Real-time validation prevents UI lag with 500ms debounce (Cloudflare rate limits)
```

**Why this works**: Adds status, implementation location, and constraint context without removing anything.

---

## Why This Matters

**Without these rules**: Planning docs become stale, contradictory, or incomplete. New people can't understand why decisions were made. Features get re-implemented in wrong phases. Constraints get forgotten.

**With these rules**: Planning docs stay useful as reference material even after implementation. Context is preserved. New people understand not just WHAT was built, but WHY.

---

## For Teams / Multi-Agent Environments

- **Each AI agent follows the same rules** — No accidental context loss from different interpretations
- **Code reviewers can check docs too** — "Did this PR preserve planning doc context?"
- **Onboarding is faster** — New people trust that planning docs are complete and accurate

---

## Related Documentation

See your project's planning directory for:

- `planning.md` — Master document (source of truth)
- `current-tasks.md` — Actionable items (actively modified)
- `decisions/` — Architecture decisions with rationale
- Implementation files — Code reflecting decisions
