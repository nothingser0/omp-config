---
name: tdd
description: Test-driven development with red-green-refactor cycle
---

# TDD (Test-Driven Development)

Write tests first, then make them pass.

## When to Use

- New feature with clear requirements
- Bug with reproducible failure
- Refactoring with existing tests
- API or library with defined contract

## Cycle

### Red (Write Failing Test)

```python
def test_user_can_login_with_valid_credentials():
    user = User.create(email="test@example.com", password="secret123")
    result = auth.login("test@example.com", "secret123")
    assert result.success == True
    assert result.user.id == user.id
```

Run: test fails (function doesn't exist yet).

### Green (Make It Pass)

Write minimal code to pass the test:

```python
def login(email: str, password: str) -> LoginResult:
    user = User.find_by_email(email)
    if user and user.check_password(password):
        return LoginResult(success=True, user=user)
    return LoginResult(success=False, user=None)
```

Run: test passes.

### Refactor (Clean Up)

Improve code without changing behavior:
- Extract common setup to fixtures
- Remove duplication
- Clarify naming

Run: tests still pass.

## Guidelines

- One test at a time (don't write multiple failing tests)
- Test behavior, not implementation
- Fast tests (<100ms per test)
- Deterministic (no flaky tests)
- Isolated (no shared state between tests)

## Test Structure

```
# Arrange
user = create_user()

# Act
result = do_thing(user)

# Assert
assert result.is_valid()
```

## Anti-Patterns

- Writing tests after implementation (confirmation bias)
- Testing private methods
- Mocking everything (brittle, tests implementation not behavior)
- Skipping refactor step (accumulates cruft)
