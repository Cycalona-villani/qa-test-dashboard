# QA Test Dashboard

A React and TypeScript application for managing test cases,
recording manual test results, and tracking defects.

[Live Demo](https://cycalona-villani.github.io/qa-test-dashboard/)

## Features

- Create test cases with steps, expected results, and priority.
- Record Passed, Failed, Blocked, and Not Run results.
- Report defects with reproduction steps, expected and actual
  results, and severity.
- Link defects to related test cases.
- Track defects through Open, In Progress, Resolved, and Closed.
- View dashboard counts that update when results change.
- Preserve records after refresh using browser localStorage.

The dashboard currently counts Passed, Failed, and Blocked
results as executed. Open Defects includes every defect
that has not been closed.

## Technology

- React
- TypeScript
- Vite
- CSS
- Cypress
- GitHub Actions
- GitHub Pages

## Run Locally

Requires Node.js 24 and npm.

```bash
git clone https://github.com/Cycalona-villani/qa-test-dashboard.git
cd qa-test-dashboard
npm ci
npm run dev -- --port 5173 --strictPort
```

Open:

http://localhost:5173/qa-test-dashboard/

## Automated Tests

Keep the development server running. In a second terminal:

```bash
npx cypress run
```

To use the interactive test runner:

```bash
npx cypress open
```

Three end-to-end tests cover:

1. Creating a test case, displaying its instructions, and
   preserving it after refresh.
2. Linking a defect to a test case, closing it, and verifying
   the dashboard count and saved status.
3. Recording test results, verifying dashboard counts,
   preserving results, and resetting a result to Not Run.

Each test starts with cleared browser storage for
repeatable results.

## Build

```bash
npm run build
```

## Continuous Integration and Deployment

On pushes to main, GitHub Actions:

1. Installs dependencies.
2. Builds the application.
3. Starts the development server.
4. Runs the Cypress tests.
5. Deploys the built application to GitHub Pages only
   when the build and tests succeed.

Workflow: `.github/workflows/deploy.yml`

[View Workflow Runs](https://github.com/Cycalona-villani/qa-test-dashboard/actions)

## Current Scope

This is a frontend portfolio demonstration. Records are
stored in the current browser, with no backend, shared
database, or user accounts. Data does not sync between
devices or browsers.

The sample test cases reference a separate Provider
Verification System project. Reported practice defects
are demonstration data, not confirmed issues in that system.

## Author

Cycalona Villani

[Portfolio](https://cycalona-villani.github.io/cycalona-portfolio/)