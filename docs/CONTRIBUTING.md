# Contributing to Micro-Auth

We appreciate your interest in contributing to the **Micro-Auth** project! Whether you're reporting a bug, suggesting a
feature, or submitting a pull request, we welcome your contributions. By participating, you help make the project better
for everyone.

## Table of Contents

- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Requesting Features](#requesting-features)
  - [Submitting Code](#submitting-code)
- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)

## How to Contribute

### Reporting Bugs

If you encounter any issues with the **Micro-Auth** service, please follow these steps:

1. Search the [existing issues](https://github.com/rahulc0dy/micro-auth/issues) to see if the problem has already been
   reported.
2. If the issue is not listed, open a new issue with the following details:
   - A clear and concise description of the bug.
   - Steps to reproduce the bug (if applicable).
   - Expected vs. actual behavior.
   - Screenshots or logs if available.
   - Any additional context.

### Requesting Features

If you'd like to suggest a new feature or improvement:

1. Check the [existing issues](https://github.com/rahulc0dy/micro-auth/issues) to make sure it's not already proposed.
2. Open a new issue with a detailed description of the feature, why it's needed, and any ideas on how it could be
   implemented.

### Submitting Code

We love code contributions! To submit code, please follow these steps:

1. Fork the repository and clone it to your local machine.

   ```bash
   git clone https://github.com/rahulc0dy/micro-auth.git
   cd micro-auth
   ```

2. Create a new branch for your changes.

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and write tests if necessary.

4. Ensure that your changes follow the coding standards outlined below.

5. Run the tests to make sure everything works.

   ```bash
   deno test
   ```

6. Commit your changes with a clear message describing what you've done.

   ```bash
   git add .
   git commit -m "feat(feature-name): description of your feature"
   ```

7. Push your branch to your fork.

   ```bash
   git push origin feature/your-feature-name
   ```

8. Open a pull request against the master branch of the Micro-Auth repository.

When submitting a pull request:

- Provide a detailed description of what your changes do.
- Reference any related issues with #issue-number (e.g., Closes #123).
- Make sure the pull request is up-to-date with the master branch to avoid merge conflicts.

### Code of Conduct

Please be respectful and considerate to everyone participating in the Micro-Auth project. We expect all contributors to
follow the [Code of Conduct](https://github.com/rahulc0dy/micro-auth/blob/master/.github/CODE_OF_CONDUCT.md).

### Development Setup

To get started with development on Micro-Auth, follow these instructions:

1. Clone the repository.

   ```bash
   git clone https://github.com/rahulc0dy/micro-auth.git
   ```

2. Install the dependencies.

   ```bash
   deno task deps
   ```

3. Set up the environment variables as shown in the `.env.example` file

4. Run the development server.

   ```bash
   deno task dev
   ```

You can now access the authentication microservice on `http://localhost:<PORT>`.

#### Coding Standards

- TypeScript: Follow Airbnb JavaScript style guide.

- Code Formatting: Use Prettier to automatically format your code. Ensure it’s set up in your editor.

- Linting: Use ESLint to catch code quality issues. You can run linting with:

- Commit Messages: Follow the Conventional Commits standard.

Thank you for contributing to Micro-Auth! Your contributions help make the project better, and we appreciate your time
and effort.
