# 🌿 Git and Pull Request Guidelines

This document outlines our Git workflow, branch naming conventions, commit message standards, and PR requirements.

## 🌿 Branch Naming Conventions

### **Required Format:**

- **Feature branches:** `feature/TICKET-123` or `feature/description` (for new features)
- **Workflow branches:** `workflow/TICKET-456` or `workflow/description` (for CI/CD changes)
- **Bug branches:** `bug/TICKET-789` or `bug/description` (for bug fixes)
- **Infrastructure branches:** `infrastructure/TICKET-321` or `infrastructure/description` (for project structure)
- **Documentation branches:** `docs/TICKET-123` or `docs/description` (for documentation updates)

**Note:** Replace `TICKET-` with your project's ticket prefix (e.g., `PROJ-`, `ENG-`, `JIRA-`, etc.)

### **Examples:**

```bash
# Ticket based (replace TICKET- with your project's prefix)
git checkout -b feature/TICKET-123
git checkout -b bug/TICKET-789

# Descriptive naming (when no ticket)
git checkout -b feature/user-authentication
git checkout -b bug/fix-memory-leak
git checkout -b docs/update-setup-guide
```

## 📝 Commit Message Guidelines

### **Required Format:**

```
TICKET-123 Brief description of changes
```

Or when no ticket:

```
feature/branch-name - Brief description of changes
```

### **Examples:**

```bash
# With ticket (replace TICKET- with your project's prefix)
git commit -m "TICKET-123 Added user authentication flow"

# Without ticket - use your current branch name
git commit -m "feature/user-auth - Added user authentication flow"
```

## Agent pause before commit

When an AI agent is doing the work: branch, implement, and run checks. Then stop. Do not commit, push, or open a pull request until this message explicitly asks for that. A yes earlier in the chat does not cover a later commit or push.

When this message asks to open a PR: local `yarn lint`, `yarn format:check`, `yarn type-check`, and `yarn test:ci` first, then commit, push, and create the PR. Do not wait on GitHub Actions. If a test is too slow for the default 5s timeout, rewrite the test.

Quality checks and `yarn test:ci` do not run on pull requests. Run them locally. GitHub Actions on a pull request only checks the title and Why / What / How / Testing sections. Tests and lint can be started by hand from the Actions tab (`workflow_dispatch`).

## STATUS.md in a feature pull request

Write `STATUS.md` as the state after this pull request merges: this ticket Done, next ticket named. Do not write “not merged” or “review this branch.” When you open the pull request, add its URL to STATUS Pointers on the same branch before you stop.

## 👨‍💻 Developer Workflow

### **Step 1: Create Feature Branch**

```bash
git checkout -b feature/TICKET-123
# Make your changes
yarn lint          # Check for ESLint issues
yarn format:check  # Check Prettier formatting
yarn type-check    # Check TypeScript types
git add .
git commit -m "TICKET-123 Added user authentication flow"
git push origin feature/TICKET-123
```

### **Step 2: Create Pull Request**

**PR Title Format:**

```
TICKET-123 Brief description of what the PR accomplishes
```

**Note:** Replace `TICKET-` with your project's ticket prefix.

**PR Description Template:**

```markdown
## Why

**Purpose of the Change:**

- Explain the motivation behind the PR
- Describe the problem or issue it addresses

## What

**Summary of the Changes:**

- Clearly state what has been changed or added
- Outline the scope of the changes

**Files Changed:**

- List all modified files with brief descriptions

## How

**Implementation Details:**

- Describe how the changes were implemented
- Highlight key technical decisions

## Testing

**Testing Strategy and Results:**

- Describe types of tests conducted
- Mention any new tests added
- Include results from automated tests
```

### **Step 3: Merge**

1. Local `yarn lint`, `yarn format:check`, `yarn type-check`, and `yarn test:ci` already passed before the PR was opened
2. Merge your PR
3. Merge Protection deletes the feature branch after a successful merge. It does not post a comment.

## 🔄 Merge Conflict Resolution

```bash
git fetch origin main
git rebase origin/main
# Resolve conflicts in editor
git add .
git rebase --continue
git push --force-with-lease origin feature/TICKET-123
```

## 👀 How to Review a Pull Request

### **When Reviewing, Ask These Questions:**

1. **Does the code fulfill the business requirement?**
2. **Is the code implementation performant or could it be done better?**
3. **Any typos/spelling errors?**
4. **Are naming conventions correct?**
5. **Could the code cause any security issues?**

---

_These guidelines ensure consistent code quality and efficient collaboration._
