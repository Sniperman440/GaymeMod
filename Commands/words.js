const { Message } = require("discord.js");
const Gaymer = require("../handlers/Client");

//mrow

module.exports = {
  name: "words",
  description: `list blacklisted words`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["EMBED_LINKS"],
  category: "information",
  cooldown: 1,

  /**
  *
  * @param {Gaymer} client
  * @param {Message} message
  * @param {String[]} args
  * @param {String} prefix
  */
  run: async (client, message, args, prefix) => {
    const member = message.guild.members.cache.get(message.author.id);
    if (client.config.whitelisted.some((roleId) => member.roles.cache.has(roleId))) {
      message.reply(`||\`${client.config.blacklistedWords.join('\`, \`')}\`||`);
      return;
    }
    return;
  },
}
