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

Run the following commands in the console to install dependencies and
build the bot.

```shell
npm install
npm run build
```

### Config

Create a file called `config.js` in the `dist` folder. Paste the following
in it:

```js
export const clientId = "YOUR_BOT_CLIENT_ID";
export const guildId = "YOUR_TESTING_GUILD_ID";
export const token = "YOUR_BOT_TOKEN";
```

Replace each string with their respective IDs/token. `guildId` may be specified
to quickly register commands in a testing server (global command registration
on the other hand can take up to an hour).

### Register commands

You need to register commands at least once.

```shell
# Register commands in one guild (instant)
npm run register-commands
# Register commands globally (may take up to an hour)
npm run register-commands global
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
