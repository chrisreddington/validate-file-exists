# Validate File Exists Action

This is a TypeScript-based GitHub Action that validates whether specified files
exist in a repository. It takes a comma-separated list of files and validates
their existence, failing the workflow if any files are missing. Please follow
these guidelines when contributing:

## Code Standards

### Required Before Each Commit

- Run `npm run format:write` to ensure consistent code formatting with Prettier
- Run `npm run lint` to check for ESLint violations
- Run `npm run test` to ensure all tests pass
- Run `npm run local-action` to test the action locally with a `.env` file

### Development Flow

- Build: `npm run package` (compiles TypeScript and bundles with ncc)
- Test: `npm run test` or `npm run ci-test`
- Coverage: `npm run coverage` (generates coverage badge)
- Full check: `npm run all` (format, lint, test, coverage, package)
- Local testing: `npm run local-action` (test action locally with .env file)

## Repository Structure

- `src/`: Core TypeScript source code
  - `main.ts`: Main entry point and action orchestration
  - `fileValidator.ts`: Core file validation logic
  - `index.ts`: Action entrypoint that calls run()
  - `types.ts`: TypeScript type definitions
- `__tests__/`: Jest unit tests for all source files
- `dist/`: Compiled and bundled JavaScript output (generated)
- `action.yml`: GitHub Action metadata and interface definition
- `script/`: Release automation scripts
- `badges/`: Generated coverage and status badges

## Key Guidelines

1. Follow TypeScript strict mode and best practices
1. Use clear, descriptive variable and function names
1. Add TSDoc comments for all public methods and classes
1. Write comprehensive unit tests using Jest for all new functionality
1. Keep functions focused and manageable (generally under 50 lines)
1. Use consistent error handling with @actions/core.setFailed()
1. Validate inputs and provide meaningful error messages
1. Use @actions/core for all GitHub Actions integrations (inputs, outputs,
   logging)
1. Maintain backwards compatibility for action inputs/outputs
