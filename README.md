# Fragbot
This is a simple program to host and automate a fragrun bot for Hypixel Skyblock.

## Features
- Auto Send to Limbo.
- Queue system if multiple users party it at a time.
- Simple configuration.

## Installation
- Rename `config.example.json` to `config.json` and fill out the fields.
- Run `npm install`.
- Done! 

## Usage
- To start the bot, run `npm start` or `node main.js`.
- The bot will join Hypixel and automatically get into Limbo.
- When it recieves a party invite, it accepts it and then leaves after 5 seconds (configurable in `config.json`, `fragbot.waitTime` field).
