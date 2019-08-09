# Baw Client

The Angular 8 client for the bioacoustic workbench

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

### Testing

#### End to End Testing

To run the application end to end test suite:

```bash
$ npm run e2e
```

This will run the entire test suite in both Mozilla Firefox and Google Chrome browsers. End to end tests are used to determine if an application is working across multiple user actions over multiple pages.

#### Unit tests

To run the application unit test suite:

```bash
$ npm test
```

This will run the entire test suite in both Mozilla Firefox and Google Chrome browsers. Unit tests are used to determine if singular segments of the application are functioning correctly.

## To build

To build the application in production mode:

```bash
$ npm run build:prod
```

Move the generated files from the `/dist` directory to the required location.

### Environments

There are three environments supported by this application.

- Development: Building the application with debugging tools
  - `npm run build`
- Staging: Building the latest changes in production mode for testing before release
  - `npm run build:staging`
- Production: Building the latest changes in production mode for release
  - `npm run build:prod`

## Licence

MIT License
