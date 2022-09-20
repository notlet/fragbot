const mineflayer = require("mineflayer");
const log = (...args) => require("process").stdout.write((config.fragbot.logTime ? `<${new Date(Date.now()).toLocaleTimeString()}> ` : "") + args.join("") + "[0m\n");
const config = require("./config.json");
const whitelist = require("fs").existsSync(__dirname + "/whitelist.json") ? require("./whitelist.json") : { "enabled": false };

const bot = mineflayer.createBot({
    host: config.server.ip,
    port: config.server.port,
    username: config.minecraft.username,
    password: config.minecraft.password,
    version: "1.8.9",
    auth: config.minecraft.accountType,
})

const limbo = () => {
    log('[33mSending bot to Limbo...');
    Array.from(Array(12)).forEach(() => bot.chat("/"));
}

bot.once("login", () => console.log("Bot joined the server."))
bot.once("spawn", () => {bot.chat("/party leave"); setTimeout(() => limbo, 2000)});

let partyQueue = [];
let currentlyInParty = false;
let leaveTimeout;

const processQueue = () => {
    if (currentlyInParty) return;
    currentlyInParty = true;
    bot.chat(`/party join ${partyQueue[0]}`);
    log(`[32mJoined ${partyQueue[0]}'s party${config.fragbot.waitTime > 0 ? `, waiting ${config.fragbot.waitTime} seconds...` : "."}`)
    if (config.fragbot.waitTime > 0) leaveTimeout = setTimeout(leaveParty, config.fragbot.waitTime * 1000);
}
const leaveParty = () => {
    if (partyQueue.length <= 0) return;
    bot.chat('/party leave');
    log(`[31mLeft ${partyQueue.shift()}'s party. There are ${partyQueue.length} more users waiting.`);
    setTimeout(() => {
        currentlyInParty = false;
        if (partyQueue.length > 0) processQueue();
    }, 1000);
}

bot.on("message", event => {
    let message = event.toString().trim();
    if (message.endsWith(' the lobby!') || message.endsWith(' the lobby! <<<')) limbo();
    if (message.includes("You were spawned in Limbo.")) log("[32mSuccessfully spawned in Limbo.");
    if (message.includes("has invited you to join their party!")) {
        let user = message.match(/^(?:\[.+\]|)\s*(.+) has invited you to join their party!/m)[1];
        if (whitelist.enabled) if (whitelist.users.indexOf(user) < 0) return;
        partyQueue.push(user);
        log(`${user} partied, adding to queue...`);
        processQueue();
    }
    if (message.includes("warped the party to a SkyBlock dungeon!") && config.fragbot.leaveOnDungeonEntry || message.includes("The party was disbanded")) {
        clearTimeout(leaveTimeout);
        setTimeout(leaveParty, 1000);
    }
    if (config.fragbot.logAllMessages) log(message);
});
