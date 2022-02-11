# Thread Buffet

[![release](https://img.shields.io/github/v/release/phanabani/thread-buffet)](https://github.com/phanabani/thread-buffet/releases)
[![license](https://img.shields.io/github/license/phanabani/thread-buffet)](LICENSE)

A Discord bot that makes it easier to find active threads.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Commands](#commands)
- [License](#license)

## Install

Thread Buffet requires Node.js `^17.4.0` and NPM `^8.4.0`.
Run the following commands in the console to install dependencies and
build the bot.

```shell
npm install
npm run build
```

### Config

Create a file called `config.json` in the `dist` folder. Paste the following
in it:

```json
{
    "clientId": "YOUR_BOT_CLIENT_ID",
    "guildId": "YOUR_TESTING_GUILD_ID",
    "token": "YOUR_BOT_TOKEN"
}
```

Replace each value with their respective IDs/token. `guildId` may be specified
to quickly register commands in a testing server, but it is not required.

### Register commands

You need to register commands at least once. Run one of the following commands:

```shell
# Register commands in one guild (instant, specified in your config.json)
npm run register-commands
# Register commands globally (may take up to an hour)
npm run register-commands global
# You can also unregister commands by adding the word "unregister"
npm run register-commands unregister
```

## Usage

Run the following command in the console to run the bot.

```shell
npm run start
```

You can also run with the [PM2 process manager](https://pm2.keymetrics.io/)
(to easily run in the background).

```shell
pm2 start ecosystem.config.cjs
```

That's it! ^-^

## Commands

| Command                        | Description                                                                                       |
|--------------------------------|---------------------------------------------------------------------------------------------------|
| `ping`                         | Ping the bot.                                                                                     |
| `set-thread-channel [channel]` | Set the channel where active threads will be shared.                                              |
| `remove-thread-channel`        | Remove the previously set channel where active threads were shared (does not delete the channel). |


## License

[MIT © Phanabani.](LICENSE)
