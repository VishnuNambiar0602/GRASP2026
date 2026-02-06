# GRASP2026 - Git Branch Management Guide

This guide will walk you through creating branches, making changes, pushing to specific branches, and creating pull requests.

## Table of Contents
- [Creating a New Branch](#creating-a-new-branch)
- [Switching Between Branches](#switching-between-branches)
- [Making Changes and Committing](#making-changes-and-committing)
- [Pushing Changes to a Specific Branch](#pushing-changes-to-a-specific-branch)
- [Creating a Pull Request (PR)](#creating-a-pull-request-pr)
- [Best Practices](#best-practices)

---

## Creating a New Branch

### Method 1: Create and Switch to New Branch
```bash
git checkout -b branch-name
```

### Method 2: Create Branch Without Switching
```bash
git branch branch-name
```

### Example:
```bash
git checkout -b feature/new-feature
```

---

## Switching Between Branches

### Switch to an Existing Branch
```bash
git checkout branch-name
```

### Switch to Main/Master Branch
```bash
git checkout main
# or
git checkout master
```

### Example:
```bash
git checkout feature/new-feature
```

---

## Making Changes and Committing

### 1. Check Status of Your Changes
```bash
git status
```

### 2. Add Files to Staging Area

**Add a specific file:**
```bash
git add filename.txt
```

**Add all changed files:**
```bash
git add .
```

### 3. Commit Your Changes
```bash
git commit -m "Your descriptive commit message"
```

### Example Workflow:
```bash
# Make changes to your files
git status                           # Check what files changed
git add .                           # Stage all changes
git commit -m "Add new feature"     # Commit with message
```

---

## Pushing Changes to a Specific Branch

### Push to the Same Branch (First Time)
When pushing a new branch for the first time:
```bash
git push -u origin branch-name
```

### Push to the Same Branch (Subsequent Pushes)
After the first push, you can simply use:
```bash
git push
```

### Push to a Different Remote Branch
```bash
git push origin local-branch-name:remote-branch-name
```

### Examples:
```bash
# First time pushing a new branch
git push -u origin feature/new-feature

# Subsequent pushes
git push

# Push local branch to different remote branch
git push origin feature/new-feature:feature/updated-feature
```

---

## Creating a Pull Request (PR)

### Step 1: Push Your Branch to GitHub
```bash
git push -u origin your-branch-name
```

### Step 2: Create PR on GitHub

**Option A: Via GitHub Web Interface**
1. Go to your repository on GitHub
2. Click on "Pull requests" tab
3. Click "New pull request"
4. Select the **base branch** (usually `main` or `master`)
5. Select the **compare branch** (your feature branch)
6. Click "Create pull request"
7. Add a title and description
8. Click "Create pull request"

**Option B: Using GitHub CLI**
```bash
# Install GitHub CLI first (gh)
gh pr create --base main --head your-branch-name --title "PR Title" --body "PR Description"
```

### Step 3: After Creating PR
- Request reviewers
- Add labels if needed
- Wait for approval
- Merge the PR once approved

---

## Best Practices

### Branch Naming Conventions
```
feature/description    # For new features
bugfix/description     # For bug fixes
hotfix/description     # For urgent fixes
docs/description       # For documentation
refactor/description   # For code refactoring
```

### Commit Message Best Practices
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference issue numbers when applicable: "Fix login bug #123"

### Example Workflow:
```bash
# 1. Create and switch to new branch
git checkout -b feature/user-authentication

# 2. Make changes to your files
# ... edit files ...

# 3. Stage and commit changes
git add .
git commit -m "Add user authentication system"

# 4. Push to GitHub
git push -u origin feature/user-authentication

# 5. Create PR on GitHub (via web interface or CLI)
gh pr create --base main --head feature/user-authentication

# 6. After PR is approved, merge it on GitHub
```

### Keeping Your Branch Updated
```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Switch back to your branch
git checkout your-branch-name

# Merge main into your branch
git merge main
```

---

## Quick Reference Commands

```bash
# Create new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name

# Check current branch
git branch

# Stage changes
git add .

# Commit changes
git commit -m "message"

# Push to remote
git push -u origin branch-name

# Pull latest changes
git pull origin branch-name

# View all branches
git branch -a

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name
```

---

## Need Help?

If you encounter any issues:
1. Check `git status` to see current state
2. Use `git log` to view commit history
3. Use `git branch` to see all branches
4. Consult [Git Documentation](https://git-scm.com/doc)

---

**Happy Coding! 🚀**