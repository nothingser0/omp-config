---
name: diagnose
description: Systematic debugging for hard bugs, regressions, or mysterious failures
---

# Diagnose

Four-phase root cause debugging for non-obvious failures.

## When to Use

- Bug reproduces but cause unclear
- Regression without obvious culprit
- Performance degradation
- Intermittent failures

## Phases

### 1. Reproduce (Establish Ground Truth)

Minimal repro case:
- Exact steps to trigger
- Expected vs actual behavior
- Environment (OS, versions, config)
- Logs/errors at point of failure

Goal: Reliable reproduction in <1 minute.

### 2. Isolate (Binary Search)

Narrow the search space:
- **Temporal**: Bisect commits if regression
- **Spatial**: Comment out code blocks until failure disappears
- **Input**: Minimize test case (remove fields, simplify data)
- **Environment**: Toggle flags, swap dependencies

Goal: Smallest change that flips behavior.

### 3. Explain (Hypothesis)

Form testable hypothesis:
- Why does minimal change cause the behavior?
- What invariant is violated?
- What assumption is wrong?

Test hypothesis: add logging, assertions, or controlled experiments.

### 4. Fix & Verify

- Apply minimal fix targeting root cause
- Add regression test (failing before, passing after)
- Verify original issue resolved
- Check for similar patterns elsewhere

## Anti-Patterns

- Fixing symptoms (suppressing errors, adding retries)
- Guessing without testing hypothesis
- Skipping reproduction (relying on user reports)
- Over-fixing (refactoring unrelated code)
