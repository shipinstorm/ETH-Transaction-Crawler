# Crawthereum

## Description

Crawthereum is a simple web app that displays transactions for a given Ethereum Wallet address

## Getting Started

### Cloning the Repo

- Clone this repository to your local machine

### Setting up the environment variable file

Crawthereum uses a free API service provided by [Etherscan.io](https://etherscan.io/) for which you need an API Key. Visit the website and create an account to get your free API Key. Then follow steps below to set up your environment variable

- In the root directory, create a new `.env` file
- Inside the `.env` file, paste in the following code while replacing "YOUR_API_KEY" with the API Key from [Etherscan.io](https://etherscan.io/)

```
REACT_APP_API_KEY=YOUR_API_KEY
```

- Save and close `.env` file.

### Installing

- Install dependencies by running:

```
npm install
```

or

```
yarn
```

### Starting the server

- Run below command to start the dev server

```
npm start
```

or

```
yarn start
```

Open your browser and navigate to:

```
http://localhost:3000/
```

## Acknowledgments

- [Etherscan](https://etherscan.io)
- [Rimble UI](https://rimble.consensys.design/)
- [Material UI](https://material-ui.com/)
