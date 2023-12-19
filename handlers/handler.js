// Typedef
/**
 * @typedef {import('../../handlers/Client')} PH
 */

// Imports
const { readdirSync } = require("fs");
const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

/**
 * @param {PH} client
 */
module.exports = async (client) => {
  try {
    const commands = readdirSync(`./Commands/`).filter((f) =>
        f.endsWith(".js")
      );
      for (const cmd of commands) {
        const command = require(`../Commands/${cmd}`);
        if (command.name) {
          client.mcommands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases))
            command.aliases.forEach((a) => client.aliases.set(a, command.name));
        } else {
          console.log(`${cmd} is not ready`);
        }
      }
    console.log(`${client.mcommands.size} Message Commands Loaded`);
  } catch (error) {
    console.log(error);
  }

  // Loading Event Files
  try {
    let eventCount = 0;
    readdirSync("./events")
      .filter((f) => f.endsWith(".js"))
      .forEach((event) => {
        require(`../events/${event}`);
        eventCount++;
      });
    console.log(`${eventCount} Events Loaded`);
  } catch (e) {
    console.log(e);
  }
};