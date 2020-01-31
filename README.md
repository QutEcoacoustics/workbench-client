# Workbench Client

The Angular 8 client for an acoustic workbench application.

[![Build Status](https://dev.azure.com/QutEcoacoustics/acoustic-workbench/_apis/build/status/QutEcoacoustics.workbench-client?branchName=master)](https://dev.azure.com/QutEcoacoustics/acoustic-workbench/_build/latest?definitionId=4&branchName=master)

## Install instructions

### Requirements

- Node v12.8.0 or greater
- NPM v6.10.0 or greater
- Google Chrome
- Mozilla Firefox

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

### Documentation

This project implements the compodoc documentation tool. To generate the documentation for yourself, run the following command:

```javascript
npm run documentation:generate
```

This will create a `./documentation` folder containing the generated documentation. To view this in your web browser, run the following command:

```javascript
npm run documentation
```

### Testing

#### End to End Testing

To run the application end to end test suite:

```bash
$ npm run e2e
```

#### Unit tests

This project has a number of options when it comes to testing. For development we utilize the chrome browser for testing, however the application should support the following browsers: Chrome, Firefox, Edge.

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

All Supported Browsers Testing:

```bash
$ npm run test:all
```

#### Code Coverage

On the completion of the unit tests, the system will automatically generate a code coverage report. To open this, run the following command:

```bash
$ npm run code-coverage
```

## To build

To build the application in production mode:

```bash
$ npm run build
```

Move the generated files from the `/dist` directory to the required location.

### Environments

There are three environments supported by this application.

- Development: Building the application with debugging tools
  - `$ npm run build:dev`
- Staging: Building the latest changes in production mode for testing before release
  - `$ npm run build:staging`
- Production: Building the latest changes in production mode for release
  - `$ npm run build`

## Common Problems

Check our Wiki pages for help with common problems and using systems custom to our application.

## Licence

Apache License, Version 2.0
