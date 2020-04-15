# minibot
A Discord bot for the http://berlinminijam.de.

## Commands
- `!idea [IDEA]` - create a text and voice channel for the idea in the brainstorming category
- `!team [TEAM NAME]` - create a text and voice channel for the team in the team category
- `!archive [PREFIX]` - moves all text channels from the brainstorming/team sections into the respective archive sections, adding "PREFIX-" in front of them. Removes all voice channels in the brainstorming/team sections. Can only be called by members who have the MANAGE_CHANNELS permission.

## How to run
1. Install Node.js: https://discordjs.guide/preparations/#installing-node-js
2. Clone this repository.
3. Open a console into the repository folder and run `npm install`.
4. Set up your bot application: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot
5. Rename `.env.template` to `.env` and put your bot token from the last step after `BOT_TOKEN=`.
6. Add your server to the `guildDataById` section of `config.json`, filling in the category IDs (turn on developer mode in User Settings -> Appearance -> Enable Developer Mode and then get the category IDs via right click and "Copy ID").
7. Add your bot to your server via this link, replacing YOURCLIENTID with the client ID of your bot application from step 4: https://discordapp.com/api/oauth2/authorize?client_id=YOURCLIENTID&permissions=16&scope=bot
8. Done!