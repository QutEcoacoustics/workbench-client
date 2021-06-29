# Workbench Client

The Angular client for an acoustic workbench application.

[![Build, Test, and Publish](https://github.com/QutEcoacoustics/workbench-client/workflows/Build,%20Test,%20and%20Publish/badge.svg)](https://github.com/QutEcoacoustics/workbench-client/actions)
[![DOI](https://zenodo.org/badge/195738695.svg)](https://zenodo.org/badge/latestdoi/195738695)
[![Docker Image Version (latest semver)](https://img.shields.io/docker/v/qutecoacoustics/workbench-client?label=docker%20image%20version&sort=semver&style=plastic)](https://hub.docker.com/repository/docker/qutecoacoustics/workbench-client)

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

Normal development

```bash
$ npm start
```

Then open a web browser to `http://localhost:4200`.

Server side rendering

```bash
$ npm run serve:ssr
```

Then open a web browser to `http://localhost:4000`.

### Environment

This website can be customised through the environment file located at `./src/assets/environment.json` (note: look at the docker section for deploying environment files). Here is a list of settings and some example values:

Parameter | Description | Example Value
----------|-------------|--------------
`endpoints.environment` | The environment for this instance. Currently used only for informational purposes. | `development`<br>`staging`<br>`production`
`endpoints.apiRoot` | Any API requests made from the app will use this value for its base and append routes to it | `https://ecosounds.org`<br>`https://ecosounds.org:3000`<br>`https://ecosounds.org/api`
`endpoints.clientOrigin` | This is the [origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin) of where the website will be hosted | `https://ecosounds.org`<br>`https://ecosounds.org:3000`
`endpoints.clientDir` | This is the directory on the `clientOrigin` which the website is hosted | `/website`<br>`/web/angular`
`keys.googleMaps` | Google maps API key | Check googles official setup guide
`keys.googleAnalytics` | Google analytics domain and tracking ID | Check googles official setup guide
`settings.brand.short` | This changes the logo branding of the website | `Ecosounds`
`settings.brand.long` | This changes the full length name of the website | `Ecosounds - Acoustic Workbench`
`settings.links` | This is a list of external links used throughout the website. Check the template for the list of modifiable links |
`settings.customMenu` | This is a list of custom menu items which changes the contents of the header with instance specific links. Check the template for examples |

### Access the ng tool

```bash
$ npx ng
```

or

```bash
$ npm run ng
```

### Testing

#### End to End Testing

To run the application end to end test suite:

```bash
$ npm run e2e
```

Note: Make sure you are running the 64 bit version of chrome installed to the following folder: `C:/Program Files/Google/Chrome/Application/chrome.exe`. Otherwise the e2e tests will fail with the following error: `E/launcher - WebDriverError: unknown error: cannot find Chrome binary`

To debug the e2e tests, read the following [guide](https://medium.com/@scott.williams.dev/how-to-debug-protractor-tests-a19568e9016f) and run the following command:

```bash
$ npm run e2e:debug
```

#### Unit tests

This project has a number of options when it comes to testing. For development we utilize the chrome browser for testing, however the application should support the following browsers: Chrome, Firefox, Edge. When attempting to test a specific file/component/service, either use the Test Explorer plugin for VSCode, or modify the `src/test.ts` file so that its regex will find the file you wish to test.

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

To build the Server Side Renderer:

```bash
$ npm run build:ssr
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

Deploying to production can be as simple as copying the release assets to a statically served directory, setting up your routing, and adding an `environment.json` file.

1. Copy and extract a release to a statically served directory like `public`
2. Template your `environment.json` and place it in the `public/workbench-client/assets` directory
3. Ensure whatever routing solution you have can route requests for SPA with a wildcard route, excepting the `assets` folder

Note: this configuration is a fully static SPA and may suffer from slow loading times and poor SEO.

### Docker

Server side rendering allows a server to render the first page and send it to the browser while the rest of the application bundle downloads. To make this work you need to run our docker container which contains the web server. The docker repository for this website can be found here: https://hub.docker.com/repository/docker/qutecoacoustics/workbench-client

#### Using a pre-built container

1. Template your `environment.json` file, and example can be found at `./src/assets/environment.json`
2. Run the following command (substituting in the path to your templated config file):

   ```bash
   $ docker pull qutecoacoustics/workbench-client:latest
   $ docker run -p 4000:4000 -v "$(pwd)/environment.json:/environment.json" qutecoacoustics/workbench-client:latest
   ```

3. Done!

#### Build container locally

To build the container locally for testing:

```bash
$ docker build -t qutecoacoustics/workbench-client .
$ docker run -p 4000:4000 -v "$(pwd)/environment.json:/environment.json" qutecoacoustics/workbench-client
```

#### Debugging the container

```bash
$ docker run -p 4000:4000 -v "$(pwd)/environment.json:/environment.json" -e DEBUG=express:* qutecoacoustics/workbench-client
```

## Licence

Apache License, Version 2.0
