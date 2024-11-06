# Validate File Exists Action

![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

A GitHub Action that validates whether specified files exist in your repository.
This action helps ensure that required files are present before proceeding with
your workflow, which is useful for validation steps or pre-deployment checks.

## Inputs

| Input   | Description                                          | Required |
| ------- | ---------------------------------------------------- | -------- |
| `files` | Comma-separated list of files to check for existence | Yes      |

## Outputs

| Output   | Description                         |
| -------- | ----------------------------------- |
| `exists` | 'true' if all specified files exist |

## Usage

### Basic Example

```yaml
steps:
  - uses: actions/checkout@v3
  - name: Validate configuration files
    uses: your-username/validate-file-exists@v1
    with:
      files: config.json
```

### Multiple Files Example

```yaml
steps:
  - uses: actions/checkout@v3
  - name: Validate configuration files
    uses: your-username/validate-file-exists@v1
    with:
      files: config.json,settings.yml,env.development
```

### Error Handling

If any of the specified files are missing, the action will:

1. Fail with a detailed error message listing all missing files
2. Exit with a non-zero status code, which will cause the workflow to fail

Example error message:

```
Error: The following files do not exist: config.json, settings.yml
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
