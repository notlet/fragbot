# Fragbot
This is a simple program to host and automate a fragrun bot for Hypixel Skyblock.

## Features
- Auto Send to Limbo.
- Queue system if multiple users party it at a time.
- Simple configuration.
- Whitelist users (toggleable)

## Installation
- Rename `config.example.json` to `config.json` and fill out the fields.
- *(OPTIONAL)* Rename `whitelist.example.json` to `whitelist.json` and set the `enabled` field to `true`.
- Run `npm install`.
- Done! 

## Usage
- To start the bot, run `npm start` or `node fragbot.js`.
- The bot will join Hypixel and automatically get into Limbo.
- When it recieves a party invite, it accepts it and then leaves after 5 seconds (configurable in `config.json`, `fragbot.waitTime` field).
- To add a user to whitelist, run `npm run whitelist [username]` or `node addToWhitelist.js [username]`.

## Configuration
- `server`:
    - `ip` - ip of the server to connect to.
    - `port` - port of the server to connect to (most often `25565`).
- `minecraft`:
    - `username` - email of your Mojang/Microsoft account.
    - `password` - password of your Mojang/Microsoft account.
    - `accountType` - `mojang` or `microsoft`, type of your account.
- `fragbot`:
    - `logAllMessages` - if set to `true`, logs all messages the fragbot recieves into console.
    - `logTime` - if set to `true`, logs the time of all fragbot events into console.
    - `leaveOnDungeonEntry` - if set to `true`, the bot will leave party when the leader enters a dungeon, skipping the usual set wait.
    - `waitTime` - how many seconds will the bot wait in party before leaving (set to 0 to not leave).
    - `responsesEnabled` - if set to `true`, the bot will notify users about queue length and send a welcome message on party join.