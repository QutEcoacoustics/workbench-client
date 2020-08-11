# Workbench Client

The Angular client for an acoustic workbench application.

![Build, Test, and Publish](https://github.com/QutEcoacoustics/workbench-client/workflows/Build,%20Test,%20and%20Publish/badge.svg)

## Install instructions

### Requirements

Generally we try to stick to the Latest Stable Release (LSR) for all requirements and dependencies.

- Node LSR
- NPM LSR
- Chrome LSR
- Firefox LSR
- Edge (Chromium) LSR

### Installation

To install project dependencies run:

```bash
$ npm install
```

## To develop:

```bash
$ npm start
```

Then open a web browser to `http://localhost:4200`.

### Access the ng tool

```bash
$ npx ng
```

or

```bash
$ npm run ng
```

### Extensions

The workspace comes with a list of extensions which may help you when it comes to working on the application. Currently the Angular Language Service extension does not officially support the version of typescript that this project is running, and you will need to upgrade it to a beta release: https://github.com/angular/vscode-ng-language-service/issues/797 https://github.com/angular/vscode-ng-language-service/releases/tag/v0.1000.0-rc.1

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

Edge (Chromium Based) Browser Testing:

```bash
$ npm run test:edge
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

```bash
$ npm run stats
```

This will allow you to compare the bundle size impacts before and after the update by switching between checked out commits/branches.

## Common Problems

Check our Wiki pages for help with common problems and using systems custom to our application.

## Production deploy

Deploying to production can be as simple as copying the release assets to a
statically served directory, setting up your routing, and adding an `environment.json` file.

1. Copy and extract a release to a statically served directory like `public`
2. Template your `environment.json` and place it in the `public/workbench-client/assets` directory
3. Ensure whatever routing solution you have can route requests for SPA with a wildcard route, excepting the `assets` folder

Note: this configuration is a fully static SPA and may suffer from slow loading
times and poor SEO.

### Docker

Server side rendering allows a server to render the first page and send it to
the browser while the rest of the application bundle downloads. To make this work
you need to run our docker container which contains the web server.

1. Template your `environment.json` file
2. Run the following command (substituting in the path to your templated config file):
```
docker run -p 4000:4000 \
  -v "$(pwd)/environment.json:/environment.json" \
  qutecoacoustics/workbench-client
```

Done!


To build the container locally for testing:

```
docker build -t qutecoacoustics/workbench-client .
```

And for debugging the express server:

```
 docker run -p 4000:4000 -v $(pwd)/environment.json:/environment.json -e DEBUG=express:* qutecoacoustics/workbench-client
 ```

## Licence

Apache License, Version 2.0
