require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, guildDataById } = require('./config.json');

client.once('ready', () => {
    console.log('Ready!');
});

client.login(process.env.BOT_TOKEN);

client.on('message', message => {
    try {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        console.log("> " + message.content);

        const parts = message.content.slice(prefix.length).split(" ");
        const command = parts.shift().toLowerCase();
        const args = parts.join(" ").trim();

        const guildData = guildDataById[message.guild.id];
        if (!guildData) {
            console.log(`No data about guild ${message.guild.name} with ID ${message.guild.id}`);
            informUser(message, "sorry, I'm not correctly configured yet for this server.");
            return;
        }

        switch (command) {
            case "help":
                commandHelp(message);
                break;

            case "idea":
                commandIdea(message, args, guildData);
                break;

            case "team":
                commandTeam(message, args, guildData);
                break;

            case "archive":
                commandArchive(message, args, guildData);
                break;
        }
    } catch (e) {
        console.log(e);
    }
});

/**
 * @param {Discord.Message} message
 * @param {string} args
 */
async function commandHelp(message) {
    informUser(message, "here is a list of my commands:\n" +
        "- `!idea [IDEA]` - create a text and voice channel for the idea in the brainstorming section\n" +
        "- `!team [TEAM NAME]` - create a text and voice channel for the team in the team section\n"
    );
}

/**
 * @param {Discord.Message} message
 * @param {string} args
 */
async function commandIdea(message, args, guildData) {
    const { brainstormingCategoryId } = guildData;

    if (!args) {
        informUserSyntax(message, "!idea [IDEA]", "!idea GTA but you are a cat");
        return;
    }

    const title = args;
    var channelText = await createChannelPair(message, title, brainstormingCategoryId);

    informUser(message, `nice idea! Here's your channel for talking about it: ${channelText}. I've also created a voice channel for it if you want to use it!`);
    //informUser(message, `nice! I'd create a channel for your idea titled '${title}' with the description '${description}', but I have no idea how :cry:`);
}

/**
 * @param {Discord.Message} message
 * @param {string} args
 */
async function commandTeam(message, args, guildData) {
    const { teamCategoryId } = guildData;

    if (!args) {
        informUserSyntax(message, "!team [TEAM NAME]", "!team Large Alligator");
        return;
    }

    const title = args;
    var channelText = await createChannelPair(message, title, teamCategoryId);

    informUser(message, `here is a channel for your team: ${channelText}. I've also created a voice channel for it if you want to use it!`);
    //informUser(message, `nice! I'd create a channel for your idea titled '${title}' with the description '${description}', but I have no idea how :cry:`);
}

/**
 * @param {Discord.Message} message
 * @param {string} title
 * @param {string}
 */
async function createChannelPair(message, title, category) {
    var settings = {
        parent: category,
        permissionOverwrites: [
            {
                id: message.author.id,
                allow: ["MANAGE_CHANNELS"]
            },
        ]
    };
    var channels = message.guild.channels;
    var channelText = await channels.create(title, {
        ...settings
    });
    await channels.create(channelText.name, {
        ...settings,
        type: "voice"
    });
    return channelText;
}

/**
 * @param {Discord.Message} message
 */
async function commandArchive(message, args, guildData) {
    const { brainstormingCategoryId, brainstormingArchiveCategoryId, teamCategoryId, teamArchiveCategoryId } = guildData;

    if (!message.member.hasPermission('MANAGE_CHANNELS')) {
        informUserMissingRights(message);
        return;
    }

    if (!args) {
        informUserSyntax(message, "!archive [PREFIX]", "!archive 2020-04");
        return;
    }

    var channels = message.guild.channels;

    var prefix = `${args}-`;
    for (var [_, channel] of channels.cache) {
        var isBrainstormingChannel = (channel.parentID === brainstormingCategoryId);
        var isTeamChannel = (channel.parentID === teamCategoryId);
        if (isBrainstormingChannel || isTeamChannel) {
            if (channel.type == "text") {
                await channel.edit({
                    name: prefix + channel.name,
                    parentID: isBrainstormingChannel ? brainstormingArchiveCategoryId : teamArchiveCategoryId
                });
            } else if (channel.type == "voice") {
                await channel.delete();
            } else {
                console.log("Archive: No idea what to do with a channel of type " + channel.type);
            }
        }
    }

    informUser(message, `all idea and team channels were moved to their archives.`);
}

/**
 * @param {Discord.Message} message
 * @param {string} text
 */
function informUser(message, text) {
    message.reply(text);
}

/**
 * @param {Discord.Message} message
 * @param {string} syntax
 */
function informUserSyntax(message, syntax, example) {
    message.reply(`sorry, I didn't quite understand that. The syntax is: \`${syntax}\`, so for example \`${example}\``);
}

/**
 * @param {Discord.Message} message
 * @param {string} syntax
 */
function informUserMissingRights(message) {
    message.reply("sorry, can't let you do that.");
}

