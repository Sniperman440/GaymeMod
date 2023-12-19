const {
    cooldown,
    toPascalCase,
} = require("../handlers/functions");
const client = require('..');
const { prefix, emoji } = require("../settings/config");
const { PermissionFlagsBits } = require("discord.js");

client.on("messageCreate", async (message) => {

    if (message.author.id !== client.user.id &&
        //message.author.bot &&
        client.config.categories.includes(message.channel.parentId) &&
        client.config.blacklistedWords.some((word) =>
        new RegExp(
            `\\b${word
              .split('')
              .join('\\s*[\\W_]*')
              .replace(/\s/g, '\\s*')}\\b`,
            'gi'
        ).test(message.content)))
    {

        const chnl = client.channels.cache.get("1186738350053400676") //client.channels.cache.get(client.config.channel);
        const word = client.config.blacklistedWords.find(word => message.content.toLowerCase().includes(word.toLowerCase()));

        chnl.send(
            `
            **User**: ***${message.author.username}***\n**In ${message.channel}** [(link to message)](https://discord.com/channels/${message.guildId}/${message.channel.id}/${message.id})\n**Message:**\n\`${message.content}\`\n**Triggered word:** \`${word}\`
            `
        );
        return;
    };

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