const mineflayer = require("mineflayer");
const log = (...args) => require("process").stdout.write((config.fragbot.logTime ? `<${new Date(Date.now()).toLocaleTimeString()}> ` : "") + args.join("") + "[0m\n");
const config = require("./config.json");
const whitelist = require("fs").existsSync(__dirname + "/whitelist.json") ? require("./whitelist.json") : { "enabled": false };

const randomString = (length = 10) => {
    let characters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
    let result = "";
    Array.from(Array(length)).forEach(() => { result = result + characters[Math.floor(Math.random() * characters.length)]; });
    return result
}

const bot = mineflayer.createBot({
    host: config.server.ip,
    port: config.server.port,
    username: config.account.username,
    password: config.account.password,
    version: "1.8.9",
    auth: config.account.accountType,
})

const limbo = () => {
    if (!require("process").argv.includes("--nolimbo")) {
        log('[33mSending bot to Limbo...');
        Array.from(Array(12)).forEach(() => bot.chat("/"));
    }
}

bot.once("login", () => log("Bot joined the server."))
bot.once("spawn", () => {bot.chat("/party leave"); setTimeout(() => limbo, 2000)});

let partyQueue = [];
let currentlyInParty = false;
let leaveTimeout;

const processQueue = () => {
    if (currentlyInParty) return;
    currentlyInParty = true;
    bot.chat(`/party join ${partyQueue[0]}`);
    if (config.fragbot.responsesEnabled) setTimeout(() => bot.chat(`/party chat [FRAGBOT] Welcome ${partyQueue[0]}${config.fragbot.waitTime > 0 ? `, leaving party in ${config.fragbot.waitTime} seconds.` : "."}`), 500);
    log(`[32mJoined ${partyQueue[0]}'s party${config.fragbot.waitTime > 0 ? `, waiting ${config.fragbot.waitTime} seconds...` : "."}`);
    if (config.fragbot.waitTime > 0) leaveTimeout = setTimeout(() => leaveParty("Timeout Passed"), config.fragbot.waitTime * 1000);
}
const leaveParty = reason => {
    if (partyQueue.length <= 0) return;
    bot.chat('/party leave');
    log(`[31mLeft ${partyQueue.shift()}'s party (Reason: ${reason}). There are ${partyQueue.length} more users waiting.`);
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
        if (partyQueue.length > 1 && config.fragbot.responsesEnabled) bot.chat(`/msg ${user} [FRAGBOT] ${config.fragbot.waitTime > 0 ? `Wait time: ${(partyQueue.length - 1) * config.fragbot.waitTime} or less seconds.` : `Queue length: ${partyQueue.length - 1}.`} | ${randomString(20)}`)
        processQueue();
    }
    if (message.includes("warped the party to a SkyBlock dungeon!") && config.fragbot.leaveOnDungeonEntry) {
        clearTimeout(leaveTimeout);
        setTimeout(() => leaveParty("Entered Dungeon"), 1000);
    }
    if (message.includes("has disbanded the party!") || message.includes("The party was disbanded")|| message.includes("You don't have an invite to that player's party.")) {
        clearTimeout(leaveTimeout);
        setTimeout(() => leaveParty("Disbanded"), 1000);
    }
    if (config.fragbot.logAllMessages) log(message);
});
