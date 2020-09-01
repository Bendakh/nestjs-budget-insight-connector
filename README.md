<p align="center">
  <a href="https://www.algoan.com/" target="blank"><img src="./assets/algoan_bi.png" alt="Algoan Logo" /></a>
</p>

# Algoan NestJS Budget Insight connector

A simple connector using [NestJS](https://github.com/nestjs/nest) framework to connect your service to [Budget Insight](https://www.budget-insight.com).

## Table of contents

- [About Algoan and Budget Insight](#about-algoan-and-budget-insight)
- [Goal and Philosophy](#goal-and-philosophy)
- [Listened Subscriptions](#listened-subscriptions)
  - [Bankreader Link Required](#bankreader-link-required)
  - [Bankreader configuration required](#bankreader-configuration-required)
  - [Bankreader required](#bankreader-required)
- [Application Structure](#application-structure)
- [Usage](#usage)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Test](#test)
  - [How to test locally](#how-to-test-locally)
  - [How to configure](#how-to-configure)
  - [Using Docker](#using-docker)
- [Contributing](#contributing)
  - [Instructions](#instructions)
  - [Code Style](#code-style)
- [Support](#support)

## About Algoan and Budget Insight

- [Algoan](https://www.algoan.com) helps companies to build the best open banking experience for credits. To see our products, please refer to our [official website](https://www.algoan.com)
- [Budget Insight](https://wwww.budget-insight.com) is a French banking data aggregator for financial services.

## Goal and Philosophy

A [connector](https://developers.algoan.com/public/docs/algoan_documentation/chatbot_and_services/connectors.html) is a web software able to connect a provider to Algoan's API. It subscribes to [REST Hooks](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/resthooks.html) which lets Algoan notifying the connector when an specific [event](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/resthooks.html#resthook-events) happens.

More information on the [official documentation](https://developers.algoan.com).

The **`nestjs-budget-insight-connector`** focuses on a user bank accounts and transactions. The main goal of this connector is to be able to retrieve a user bank data when Algoan wishes to.

## Listened Subscriptions

This section describes the process required for each subscriptions for a [Bank reader](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/event_list.html#bank-reader) connector.

### Bankreader Link Required

When the Budget Insight user interface is not hosted by Algoan, the user needs to be redirected to an external page. The diagram below describes interactions:

![bankreader_link_required](assets/bankreader_link_required.png)

Refers to the [`bankreader_link_required`](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/event_list.html#bankreader_link_required) event.

### Bankreader configuration required

If the user interface is hosted by Algoan, the connector needs to set the plug-in for the frontend application:

![bankreader_config_required](assets/bankreader_configuration_required.png)

Refers to the [`bankreader_configuration_required`](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/event_list.html#bankreader_configuration_required) event.

### Bankreader required

When the user has finished the aggregation process, the connector has to retrieve user's banks accounts and transactions. The behavior is slightly different is you use the [`bankreader_link_required`](#bankreader-link-required) or the [`bankreader_configuration_required`](#bankreader-configuration-required) event.

Refers to the [`bankreader_required`](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/event_list.html#bankreader_required) event.

#### Redirection to BI user interface

![bankreader_required](assets/bankreader_required_1.png)

#### Using Algoan's BI plug-in

![bankreader_required_2](assets/bankreader_required_2.png)

## Application Structure

- `config/`: stores all configurations for the application. It uses [node-config-ts](https://github.com/tusharmath/node-config-ts) to generate a type definition of the `default.json` file.
- `src/algoan/`: Algoan module getting your service accounts. It uses the [@algoan/rest](https://github.com/algoan/rest-nodejs) library.
- `src/hooks/`: Entry point for your [RestHook](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/resthooks.html) called by Algoan. It handles [events](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/event_list.html) you've subscribed to.
- `src/aggregator`: contains all API calls to Budget Insight. It also handles the mapping between Budget Insight and Algoan.
- `test/`: contains e2e tests.

## Usage

How to use locally this connector.

### Requirements

This connector is a [Node.js](https://nodejs.org/en/) application available on [Docker Hub](#using-docker). Before reading further, you need to [download and install Node.js](https://nodejs.org/en/download/).

### Installation

Clone the repository:

```bash
$ git clone https://github.com/algoan/nestjs-budget-insight-connector.git --depth=1
```

Install all dependencies running:

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### How to test locally

To test locally the Budget Insight process, a simple `index.html` file is rendered. To use it:

- Create a `config/user/{process.env.USER}.json` file to override app configurations. _NOTE_: This application uses [node-config-ts](https://github.com/tusharmath/node-config-ts). See the [How to configure](#how-to-configure) section for further information.
- Run `npm start`
- Go to your favorite browser and navigate to http://localhost:8080. It should display a web page: 

![index_page](assets/index-page.png)

- Click on the first button "Launch BI redirection process". It will create a new Banks User and triggers the hooks controller.
- To be redirected to Budget Insight, click on the second button "Redirect to BI" . This will get your banks-user and redirect you to the Budget Insight redirect URL. If an alert appears, it means that the Banks user has not been updated.

### How to configure

To configure your application properly, here is a list of key to set:

| Property name | Mandatory | Type | Description |
|-|-|-|-|
| `algoan` | Yes | _object_ | Algoan base configurations to retrieve service accounts |
| `algoan.baseUrl` | Yes | _string_ | Algoan host URL |
| `algoan.clientId` | Yes | _string_ | OAuth2 Client ID provided by Algoan |
| `algoan.clientSecret` | Yes | _string_ | OAuth2 Client Secret provided by Algoan |
| `budgetInsight` | No | _object_| Budget Insight credentials if it is not set in your service account |
| `budgetInsight.url` | No | _string_ | Budget Insight sandbox URL |
| `budgetInsight.clientId` | No | _string_ | Budget Insight Client ID for the sandbox |
| `budgetInsight.clientSecret` | No | _string_ | Budget Insight Client secret for the sandbox |
| `budgetInsight.synchronizationTimeout` | No | _number_ | Timeout after each the synchronization trial is cancelled |
| `targetUrl` | No | _string_ | Target URL for your resthook. See [the documentation](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/resthooks.html#managing-your-resthook) for more information |
| `eventList` | No | _array<string>_ | Event List you want to subscribe to |
| `restHooksSecret` | No | _string_ | Resthooks secrets ensuring that all calls are made by Algoan. See [the documentation](https://developers.algoan.com/public/docs/algoan_documentation/resthooks_and_events/resthooks.html#validating-resthook-events) for more information |
| `port` | No | _number_ | Application networking port |

_NOTE_: Default values are defined in the [`config/default.json`](./config/default.json) file.

### Using Docker

If you use a Docker environment, you can pull the latest version of the connector on [Algoan's docker hub registry](https://hub.docker.com/u/algoan).

```bash
$ docker pull algoan/nestjs-budget-insight-connector
```

Then run the application:

```bash
$ docker run -p 8080:8080 algoan/nestjs-budget-insight-connector
```

As the docker image uses a production `NODE_ENV` and the [node-config-ts](https://github.com/tusharmath/node-config-ts) library, you need to create a `config/deployment/production.secret.json` file with your configurations or use environment variables:

| Variable | Description |
|-|-|
| `ALGOAN_BASE_URL` | Algoan host to retrieve service accounts |
| `ALGOAN_CLIENT_ID` | Client ID used to connect to Algoan |
| `ALGOAN_CLIENT_SECRET` | Client Secret used to connect to Algoan |

_Example_:

```bash
$ docker run -p 8080:8080 -e ALGOAN_BASE_URL=https://api.preprod.algoan.com \ 
  -e ALGOAN_CLIENT_ID=test \
  -e ALGOAN_CLIENT_SECRET=password \
  algoan/nestjs-budget-insight-connector
```

_NOTE_: For security reasons, the `index.html` is not served in production environment.
 
## Contributing

We would love to have your contribute, thank you for that! 🎉

If you want to add missing APIs, or correct an issue, you will have to follow this list of instructions.

### Instructions

- Set up your local environment by forking the repository.
- When you are about to commit, [commitlint](https://github.com/conventional-changelog/commitlint) is running to check if your commit message respects [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/).
- Write tests, there is a high coverage on the repository. Simply run `npm run test:cov` to generate a `coverage/` directory.
- Respect [coding style](#code-style). Run `npm run lint` to check if there are errors.
- Open a Pull Request where you describe the feature/issue you are about to publish.

### Code Style

This project uses [ESLint](https://eslint.org/) to analyze the TypeScript code. Commit are linted too thanks to [commitlint](https://github.com/conventional-changelog/commitlint) and the [conventional commit format](https://conventionalcommits.org/).

## Support

If you need credentials for your service, please contact support@algoan.com.
