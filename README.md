# Workbench Client

The Angular 9 client for an acoustic workbench application.

![Build, Test, and Publish](https://github.com/QutEcoacoustics/workbench-client/workflows/Build,%20Test,%20and%20Publish/badge.svg)

## Install instructions

### Requirements

- Node LTS
- NPM LTS
- Chrome LTS
- Firefox LTS
- [OPTIONAL] Edge LTS
- [OPTIONAL] Opera LTS
- [OPTIONAL] Safari LTS

### Installation

To install project dependencies run:

```bash
$ npm install
```

## To develop:

```bash
$ npm start
```

Then open a web browser to `localhost:4200`.

### Access the ng tool

```bash
$ npx ng
```

or

```
npm run ng
```

### Testing

#### End to End Testing

To run the application end to end test suite:

```bash
$ npm run e2e
```

#### Unit tests

This project has a number of options when it comes to testing. For development we utilize the chrome browser for testing, however the application should support the following browsers: Chrome, Firefox, Edge, Opera, Safari.

Development Testing:

```bash
$ npm test
```

Chrome Browser Testing:

```bash
$ npm run test:chrome
```

Firefox Browser Testing:

```bash
$ npm run test:firefox
```

Edge Browser Testing:

```bash
$ npm run test:edge
```

[BROKEN] Opera Browser Testing:

```bash
$ npm run test:opera
```

All Supported Browsers Testing:

```bash
$ npm run test:all
```

#### Code Coverage

On the completion of the unit tests, the system will automatically generate a code coverage report. You can view the report here: `./coverage/workbench-client/index.html`

## To build

To build the application:

```bash
$ npm run build
```

Move the generated files from the `/dist` directory to the required location.

## Build Statistics

When adding a library to the repository, you may wish to view its cost on the system. You can view the build size using the following command:

```typescript
$ npm run stats
```

This will allow you to compare the bundle size impacts before and after the update by switching between checked out commits/branches.

## Common Problems

Check our Wiki pages for help with common problems and using systems custom to our application.

## Licence

Apache License, Version 2.0
