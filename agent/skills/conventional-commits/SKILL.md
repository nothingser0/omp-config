---
name: conventional-commits
description: Structured commit messages for automated changelog and versioning
---

# Conventional Commits

Commit message format for semantic versioning and automated changelogs.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type (Required)

- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `docs`: Documentation only
- `style`: Formatting, whitespace (no code change)
- `refactor`: Code change that neither fixes bug nor adds feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling
- `ci`: CI/CD changes
- `revert`: Revert previous commit

### Scope (Optional)

Component or module affected:
```
feat(auth): add OAuth2 provider
fix(api): handle null response in user endpoint
```

### Subject (Required)

- Imperative mood: "add" not "added" or "adds"
- Lowercase first letter
- No period at end
- Max 72 characters

### Body (Optional)

- Explain what and why, not how
- Wrap at 72 characters

### Footer (Optional)

Breaking changes:
```
BREAKING CHANGE: user.getRole() now returns Promise<Role>
```

Issue references:
```
Closes #123
Fixes #456
```

## Examples

```
feat(payment): add Stripe payment integration

Integrate Stripe SDK for credit card processing.
Supports one-time payments and subscription billing.

Closes #234
```

```
fix(auth): prevent token expiry race condition

Token refresh now uses atomic compare-and-swap to prevent
concurrent refresh requests from causing 401 errors.

Fixes #567
```

```
refactor(database): migrate to connection pool

Replace per-request connections with pooled connections
for 3x throughput improvement under load.
```

## Breaking Changes

```
feat(api)!: remove deprecated v1 endpoints

BREAKING CHANGE: /api/v1/* endpoints removed. Migrate to /api/v2/*.
```

The `!` suffix marks breaking changes (major version bump).
