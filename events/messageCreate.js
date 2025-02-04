const {
    cooldown,
    toPascalCase,
} = require("../handlers/functions");
const client = require('..');
const { prefix, emoji } = require("../settings/config");
const { PermissionFlagsBits } = require("discord.js");

client.on("messageCreate", async (message) => {

    //automod

    if (
        message.author.id !== client.user.id &&
        client.config.categories.includes(message.channel.parentId)
      ) {
        const regex = new RegExp(
          `\\b(${client.config.blacklistedWords
            .map(word =>
              word
                .split('')
                .map(char => `[${char}${char.toUpperCase()}]`)
                .join('[\\W_]*\\w*')
            )
            .join('|')})\\b`,
          'gi'
        );
      
        const foundWords = message.content.toLowerCase().match(regex);
      
        if (foundWords && foundWords.length > 0) {
          const chnl = client.channels.cache.get(client.config.channel);
          const triggeredWords = foundWords.map(word => {
            const index = client.config.blacklistedWords.findIndex(configWord =>
              new RegExp(
                `\\b(${configWord
                  .split('')
                  .map(char => `[${char}${char.toUpperCase()}]`)
                  .join('[\\W_]*\\w*')})\\b`,
                'gi'
              ).test(word)
            );
            return index !== -1 ? client.config.blacklistedWords[index] : word;
          });
      
          chnl.send(
            `
            **User**: ***${message.author.username}***\n**In ${message.channel}** [(link to message)](https://discord.com/channels/${message.guildId}/${message.channel.id}/${message.id})\n**Message:**\n\`${message.content}\`\n**Triggered word(s):** \`${triggeredWords.join('\`, \`')}\`
            `
          );
          return;
        }
    }

      
      
      
      
      
      
      
      
      

    //prefix

    if (message.author.bot || !message.guild || !message.id) return;

    let mentionprefix = new RegExp(
        `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!mentionprefix.test(message.content)) return;
    const [, nprefix] = message.content.match(mentionprefix);
    const args = message.content.slice(nprefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) {
        if (nprefix.includes(client.user.id)) {
            client.embed(
            message,
            `${emoji.success} To See My All Commands Type \`${prefix}help\``
          );
        };
    };
    const command = client.mcommands.get(cmd)
    if (!command) return;
    if (command) {
        if (
            !message.member.permissions.has(
                PermissionFlagsBits[toPascalCase(command.userPermissions[0])] || []
            )
        ) {
            return client.embed(
                message,
                `You Don't Have \`${command.userPermissions}\` Permission to Use \`${command.name}\` Command!!`
            );
        } else if (
            !message.guild.members.me.permissions.has(
                PermissionFlagsBits[toPascalCase(command.botPermissions[0])] || []
            )
        ) {
            return client.embed(
                message,
                `I Don't Have \`${command.botPermissions}\` Permission to Use \`${command.name}\` Command!!`
            );
        } else if (cooldown(message, command)) {
            return client.embed(
                message,
                `You are On Cooldown , wait \`${cooldown(
                message,
                command
              ).toFixed()}\` Seconds`
            );
        } else {
            command.run(client, message, args, nprefix);
        };
    };
});

function escapeRegex(newprefix) {
    return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
/*
    ⣿⣿⡟⡹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⢱⣶⣭⡻⢿⠿⣛⣛⣛⠸⣮⡻⣿⣿⡿⢛⣭⣶⣆⢿⣿
    ⣿⡿⣸⣿⣿⣿⣷⣮⣭⣛⣿⣿⣿⣿⣶⣥⣾⣿⣿⣿⡷⣽⣿
    ⣿⡏⣾⣿⣿⡿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿
    ⣿⣧⢻⣿⡟⣰⡿⠁⢹⣿⣿⣿⣋⣴⠖⢶⣝⢻⣿⣿⡇⣿⣿
    ⠩⣥⣿⣿⣴⣿⣇⠀⣸⣿⣿⣿⣿⣷⠀⢰⣿⠇⣿⣭⣼⠍⣿
    ⣿⡖⣽⣿⣿⣿⣿⣿⣿⣯⣭⣭⣿⣿⣷⣿⣿⣿⣿⣿⡔⣾⣿
    ⣿⡡⢟⡛⠻⠿⣿⣿⣿⣝⣨⣝⣡⣿⣿⡿⠿⠿⢟⣛⣫⣼⣿
    ⣿⣿⣿⡷⠝⢿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣾⡩⣼⣿⣿⣿⣿⣿
    ⣿⣿⣯⡔⢛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣭⣍⣨⠿⢿⣿⣿⣿
    ⣿⡿⢫⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣝⣿
*/