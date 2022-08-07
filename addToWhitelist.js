const fs = require("fs");
const process = require("process");
const yesno = require("yesno");
const username = process.argv[2];

const askForWhitelistCreation = async() => {
    const ok = await yesno({"question": "Do you want to create it? (yes/no)"});
    if (!ok) process.exit(0);
    fs.appendFileSync(__dirname + "/whitelist.json", `{"enabled": true, "users": []}`);
    console.log("Successfully created and enabled Whitelist! Run this command again to add some users.")
}

if (!fs.existsSync(__dirname + "/whitelist.json")) {
    console.log("Unable to add a user to whitelist because file whitelist.json does not exist!");
    askForWhitelistCreation();
} else {
    let whitelist = require("./whitelist.json");
    console.log(`Added ${username} to whitelist, it now contains ${whitelist.users.push(username)} users.\nPlease relaunch the fragbot program to update the whitelist import.`);
    fs.writeFileSync(__dirname + "/whitelist.json", JSON.stringify(whitelist));
}