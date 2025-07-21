# Validate File Exists

[![GitHub Super-Linter](https://github.com/chrisreddington/validate-file-exists/actions/workflows/linter.yml/badge.svg)](https://github.com/chrisreddington/validate-file-exists)
![CI](https://github.com/chrisreddington/validate-file-exists/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/chrisreddington/validate-file-exists/actions/workflows/check-dist.yml/badge.svg)](https://github.com/chrisreddington/validate-file-exists/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/chrisreddington/validate-file-exists/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/chrisreddington/validate-file-exists/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)
[![Validate Repository Configuration](https://github.com/chrisreddington/validate-file-exists/actions/workflows/baseline.yml/badge.svg)](https://github.com/chrisreddington/validate-file-exists/actions/workflows/baseline.yml)

A GitHub Action that validates whether specified files exist in your repository.
This action helps ensure that required files are present before proceeding with
your workflow, which is useful for validation steps or pre-deployment checks.

## Inputs

| Input            | Description                                          | Required |
| ---------------- | ---------------------------------------------------- | -------- |
| `required-files` | Comma-separated list of files to check for existence | Yes      |

## Outputs

| Output   | Description                         |
| -------- | ----------------------------------- |
| `exists` | 'true' if all specified files exist |

## Usage

### Basic Example

```yaml
steps:
  - uses: actions/checkout@v4
  - name: Validate configuration files
    uses: chrisreddington/validate-file-exists@v0.0.8
    with:
      required-files: README.md
```

### Multiple Files Example

```yaml
steps:
  - uses: actions/checkout@v4
  - name: Validate configuration files
    uses: chrisreddington/validate-file-exists@v0.0.8
    with:
      required-files: 'README.md, .github/copilot-instructions.md'
```

### Advanced Example with Error Handling

```yaml
steps:
  - uses: actions/checkout@v4
  - name: Validate critical files
    id: validate
    uses: chrisreddington/validate-file-exists@v0.0.8
    with:
      required-files: 'package.json, tsconfig.json, src/main.ts'
    continue-on-error: true

  - name: Handle validation failure
    if: steps.validate.outcome == 'failure'
    run: |
      echo "Critical files are missing - this may affect the build"
      exit 1
```

### Error Handling

If any of the specified files are missing, the action will:

1. Fail with a detailed error message listing all missing files
1. Exit with a non-zero status code, which will cause the workflow to fail

Example error message:

```bash
Error: The following files do not exist: config.json, settings.yml
```

### Input Validation

The action validates input parameters and provides clear error messages for
common issues:

- **Empty input**: Throws error if no files are specified
- **Invalid format**: Handles cases with only commas or whitespace
- **File filtering**: Automatically filters out empty entries from
  comma-separated lists

Example validation errors:

```bash
Error: Input cannot be empty. Please provide a comma-separated list of files to validate.
Error: No valid files found in input. Please provide a comma-separated list of
file names.
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
