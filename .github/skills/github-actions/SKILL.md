---
name: github-actions
description: 'GitHub Actions workflow development with security best practices and CI/CD patterns. Use when creating or modifying GitHub Actions workflows, implementing SHA pinning, securing CI pipelines, setting up automated testing, or following GitHub Actions security hardening guidelines. Covers permissions, caching, conditional execution, and verification checklists.'
---

# GitHub Actions Workflow Development

Guidelines and best practices for developing secure, efficient GitHub Actions workflows.

## When to Use This Skill

- Creating new GitHub Actions workflow files
- Modifying existing workflows in `.github/workflows/`
- Implementing security best practices for CI/CD pipelines
- Setting up automated builds, tests, and deployments
- Troubleshooting workflow failures or security issues
- Reviewing workflow changes for security vulnerabilities

## Security Best Practices

### Minimal Permissions

Always start with minimal permissions at the workflow level and increase per-job only when needed:

```yaml
# ✅ Minimal at workflow level
permissions:
  contents: read

# Increase per-job only when needed
jobs:
  deploy:
    permissions:
      contents: read
      deployments: write
```

### SHA Pinning (CRITICAL)

**Always pin third-party actions to full commit SHA:**

```yaml
# ✅ Pin to commit SHA - immutable and secure
- uses: actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8  # v6.0.1
```

**Before submitting workflow changes:**

1. **Research Latest Releases**: Use web search to find the latest stable release for each action
2. **Get Commit SHA**: Retrieve the full 40-character commit SHA for that specific release
3. **Include Version Comment**: Always include the version tag as a comment (e.g., `# v4.2.2`)

### Environment Consistency

Prefer configuration files over hardcoded versions:

- Use `.node-version` or `.nvmrc` for Node.js versions
- Reference these files in the workflow to ensure consistency between local development and CI

```yaml
- uses: actions/setup-node@v4
  with:
    node-version-file: '.node-version'
```

### Script Injection Prevention

```yaml
# ✅ Safe - environment variable
- name: Check PR title
  env:
    TITLE: ${{ github.event.pull_request.title }}
  run: |
    if [[ "$TITLE" =~ ^feat ]]; then
      echo "Valid feature PR"
    fi

# ❌ Unsafe - direct interpolation
- run: |
    if [[ "${{ github.event.pull_request.title }}" =~ ^feat ]]; then
```

### Secrets Handling

```yaml
# ✅ Reference secrets properly
env:
  API_KEY: ${{ secrets.API_KEY }}

# Mask generated sensitive values
- run: |
    TOKEN=$(generate-token)
    echo "::add-mask::$TOKEN"
    echo "TOKEN=$TOKEN" >> $GITHUB_ENV
```

## Basic CI Workflow Pattern

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8  # v6.0.1
      
      - uses: actions/setup-node@395ad3262231945c25e8478fd5baf05154b1d79f  # v6.1.0
        with:
          node-version-file: '.node-version'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run validate:scripts
      - run: npm run test
      - run: npm run build
      - run: npm run lint
```

## Caching

Use setup-node's built-in caching for better performance:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version-file: '.node-version'
    cache: 'npm'
```

## Conditional Execution

```yaml
# Run only on main
- run: npm run deploy
  if: github.ref == 'refs/heads/main'

# Continue on error
- run: npm run optional-step
  continue-on-error: true

# Run even if previous failed
- run: npm run cleanup
  if: always()
```

## Verification Checklist (MANDATORY)

Before finalizing any workflow changes:

1. **Verify Each Action's Commit SHA:**
   - Use GitHub MCP tools or web search to find each action's latest release matching the version tag
   - Retrieve the correct 40-character commit SHA for that specific release tag
   - **Do NOT assume** the SHA in comments or existing workflows is correct
   - **Do NOT skip verification** even if the SHA looks "valid"

2. **Validate Action Existence:**
   - After updating SHAs, confirm the action exists at that commit
   - If fetch fails or returns 404, the SHA is invalid

3. **Test YAML Syntax:**
   - Verify the workflow has no syntax errors
   - Validate against GitHub's YAML schema

## Before Making Changes

1. Check existing `.github/workflows/` for patterns
2. Check `.github/dependabot.yml` exists before suggesting dependency automation
3. Verify action versions via releases pages
4. Consider CI time and complexity tradeoffs

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Problematic | Better Approach |
|--------------|---------------------|-----------------|
| Using version tags (`v4`) | Tags can be moved/deleted; supply chain risk | Pin to full 40-char commit SHA |
| Hardcoded Node versions | Drift between local and CI; maintenance burden | Use `.node-version` file reference |
| Direct string interpolation | Script injection vulnerability | Use environment variables |
| Workflow-level `write` perms | Excessive access if job compromised | Minimal perms at workflow, increase per-job |
| Assuming SHA validity | Outdated SHAs break workflows | Verify SHA against latest release |
| Missing SHA verification | Workflow may fail with 404 | Use GitHub MCP tools to validate |
| Skipping YAML validation | Syntax errors break CI | Validate before committing |

## Examples

### SHA-Pinned Action

```yaml
# ✅ Pinned to full commit SHA with version comment
- uses: actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8  # v6.0.1
```

### Safe Environment Variable Usage

```yaml
# ✅ Safe - PR title passed via environment variable
- name: Check PR title
  env:
    TITLE: ${{ github.event.pull_request.title }}
  run: |
    if [[ "$TITLE" =~ ^feat ]]; then
      echo "Valid feature PR"
    fi
```

### Node Version from File

```yaml
# ✅ Consistent Node version between local and CI
- uses: actions/setup-node@395ad3262231945c25e8478fd5baf05154b1d79f  # v6.1.0
  with:
    node-version-file: '.node-version'
    cache: 'npm'
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Workflow not triggering | Check event triggers and branch filters |
| Permission denied | Review and increase job-level permissions |
| Action not found | Verify commit SHA exists and is valid |
| Cache not working | Ensure cache key is deterministic and paths are correct |
| Secret not available | Check repository/organization secret configuration |

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions) - Official Actions docs
- [Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions) - Security best practices
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions) - YAML syntax reference
- [actions/checkout](https://github.com/actions/checkout) - Checkout action releases
- [actions/setup-node](https://github.com/actions/setup-node) - Node setup action releases
