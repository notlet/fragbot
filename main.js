const mineflayer = require("mineflayer");
const log = (...args) => require("process").stdout.write(args.join("") + "[0m\n");
const config = require("./config.json");

const bot = mineflayer.createBot({
    host: config.server.ip,
    port: config.server.port,
    username: config.minecraft.username,
    password: config.minecraft.password,
    version: "1.8.9",
    auth: config.minecraft.accountType,
})

let inLimbo = false;

bot.once("login", () => console.log("Bot joined the server."))

bot.on("spawn", () => {
    if (!inLimbo) {
        log("Bot joined a lobby.");
        setTimeout(() => limbo(), 2000);
    }
})

let partyQueue = [];
let currentlyInParty = false;
let processQueue = () => {
    if (currentlyInParty) return;
    currentlyInParty = true;
    bot.chat(`/party join ${partyQueue[0]}`);
    log(`[32mJoined ${partyQueue[0]}'s party, waiting 5 seconds...`)
    setTimeout(() => {
        bot.chat('/party leave');
        log(`[31mLeft ${partyQueue.shift()}'s party. There are ${partyQueue.length} more users waiting.`);
        setTimeout(() => {
            currentlyInParty = false;
            if (partyQueue.length > 0) processQueue();
        }, 1000);
    }, config.fragbot.waitTime * 1000);
}

bot.on("message", event => {
    let message = event.toString().trim();
    if (message.endsWith(' the lobby!') || message.endsWith(' the lobby! <<<')) limbo();
    if (message.includes("You were spawned in Limbo.")) log("[32mSuccessfully spawned in Limbo.");
    if (message.includes("has invited you to join their party!")) {
        let user = message.match(/^(?:\[[\w+]+\]|)\s*([0-9A-Za-z_]) has invited you to join their party!/m)[1];
        partyQueue.push(user);
        log(`${user} partied, adding to queue...`);
        processQueue();
    }
    if (config.fragbot.logAllMessages) log(message);
})

const limbo = () => {
    log('[33mSending bot to Limbo...');
    Array.from(Array(12)).forEach(() => bot.chat("/"));
    inLimbo = true;
}