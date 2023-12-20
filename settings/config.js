require('dotenv').config();
module.exports = {
    TOKEN: process.env.TOKEN,
    prefix: "yourPrefix",
    whitelisted: ["role1", "role2", "role3"],
    channel: "channelId",
    categories: ["channelCategory1", "channelCategory2"],
    blacklistedWords: [
      "badWordsHere",
    ]
};
