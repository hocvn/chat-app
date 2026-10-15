AGENTS.md
Purpose
This file defines the default rules for AI coding agents working in this repository.
Follow these rules for every task unless the user explicitly instructs otherwise.
1. Before Making Changes
- Read the project guidance before coding:
  - docs/SPEC.md — product scope and requirements.
  - docs/ARCHITECTURE.md — technical architecture and implementation decisions.
  - PLAN.md — planned work and task order.
- Inspect the existing code and repository structure before proposing or implementing changes.
- Treat the current code as the source of truth when it conflicts with documentation; update the relevant documentation when appropriate.
- Identify the goal, scope, and acceptance criteria of the task. Ask a concise question if a critical requirement is ambiguous.
- Prefer the smallest complete change that solves the task. Avoid unrelated refactors and unnecessary dependencies.
2. Implementation Rules
- Follow the project's existing conventions, architecture, naming, and formatting.
- Reuse existing components, utilities, and patterns before creating new ones.
- Keep changes focused and avoid duplicating logic.
- Do not silently change public APIs, data formats, environment variables, or architectural decisions.
- Never invent environment secrets, credentials, or production data. Keep secrets out of source control.
- Update documentation when behavior, setup steps, architecture, or project commands change.
- Do not claim a task is complete unless the relevant checks have been run or any unrun checks are clearly disclosed.
3. Git Flow
3.1 Branching
- Never work directly on master or main.
- Before editing files, run git status and inspect the current branch and working-tree changes.
- Preserve all pre-existing user changes. Do not overwrite, revert, stage, or discard them unless the user explicitly asks.
- Create and work on a task-specific branch:
  - feature/<short-description> — new functionality.
  - fix/<short-description> — bug fixes.
  - refactor/<short-description> — code restructuring without intended behavior changes.
  - docs/<short-description> — documentation-only changes.
  - test/<short-description> — test additions or changes.
  - chore/<short-description> — maintenance and tooling.
- Use lowercase kebab-case descriptions, for example feature/mood-entry-form.
- If already on a suitable task branch, continue using it. Do not create a second branch unnecessarily.
- If the current branch is main or master, create a task branch before making changes.
- If branch creation or checkout could risk losing uncommitted work, stop and ask the user how to proceed.
3.2 Commit Rules
- Use Conventional Commits:
  - feat: add mood entry form
  - fix: handle empty journal entries
  - refactor: extract date formatting utility
  - docs: update setup instructions
  - test: cover journal validation
  - chore: update dependencies
- Keep commits focused on one logical change.
- Before committing, inspect git diff and git diff --staged.
- Stage only files relevant to the task. Do not use git add . or git add -A blindly when unrelated changes may exist.
- Do not create a commit unless the user asked for a commit or the established task workflow explicitly requires it.
- Never amend or rewrite existing commits unless the user explicitly approves.
3.3 Validation Before Commit or Handoff
- Run the most relevant available checks, such as tests, linting, type checking, or a production build.
- For this repository, use the scripts actually defined in package.json; do not assume a test or lint script exists.
- Review git diff for accidental changes, debug code, secrets, generated files, and unrelated edits.
- Report checks that passed, failed, or could not be run.
3.4 Push and Pull Requests
- Never push directly to main or master.
- Do not push, open a pull request, merge a pull request, or release/deploy unless the user requested it or the task instructions clearly authorize it.
- Before pushing, confirm the target remote and branch.
- Prefer pull requests for merging task branches into the default branch.
- Do not force-push. If rewriting remote history seems necessary, stop and ask for explicit approval.
- When using GitHub CLI (gh), check authentication and repository context first. Do not assume gh is installed or authenticated.
3.5 Prohibited Destructive Actions
Without explicit user approval, never run commands that can discard work or rewrite history, including but not limited to:
- git reset --hard
- git clean -fd or other destructive git clean variants
- git checkout -- <file> or git restore <file> when it would discard user changes
- git push --force / git push -f
- history rewriting, branch deletion, or bulk file deletion
If a command's impact is uncertain, inspect its effects first and ask before proceeding.
4. Documentation and Planning
- For multi-step tasks, outline a brief plan before implementation.
- Keep PLAN.md aligned with task progress when the project workflow expects it.
- Do not mark planned work complete until implementation and relevant validation are done.
- Keep product requirements in docs/SPEC.md and technical decisions in docs/ARCHITECTURE.md.
- Do not add implementation details to product-scope documentation unless they are needed to explain a requirement.
5. Communication
- Before significant changes, briefly state the intended approach.
- If blocked by missing information, permissions, credentials, or failing tools, explain the blocker rather than pretending the operation succeeded.
- Summarize what changed, list validation results, and mention any follow-up work.
- Clearly distinguish actions completed from actions merely suggested.
- Keep explanations concise and practical.
6. Completion Checklist
Before handing off a task, verify:
- [ ] Changes match the requested scope and acceptance criteria.
- [ ] Existing user changes were preserved.
- [ ] Relevant tests/build/checks were run, or limitations were reported.
- [ ] Diff was reviewed for unrelated changes and sensitive data.
- [ ] Documentation and PLAN.md were updated when appropriate.
- [ ] Git branch and commit/push actions followed the rules above.
- [ ] Final response summarizes the implementation and validation status.