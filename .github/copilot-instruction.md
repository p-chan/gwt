# Code Review Guidelines

## Comment Prefix Rules

When reviewing code, always use one of the following prefixes:

- **MUST:** - Required changes (must be addressed before merging)
- **SHOULD:** - Recommended changes (strongly suggested, but open to discussion)
- **IMO:** - Personal opinion (optional, for reference)
- **NITS:** - Minor issues (typos, style, etc.)

## Examples

```
MUST: Avoid using `any` type. This violates strict mode.
SHOULD: Recommend using `GwtError` for error handling.
IMO: I think this logic would be more readable if extracted into a function.
NITS: Indentation is off here.
```
