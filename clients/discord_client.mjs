import discord from 'discord.js';
import dotenv from 'dotenv';
import SearchCommands from '../commands/search_commands.mjs';

class DiscordClient {

    constructor() {
        this.client = new discord.Client();
        this.result = dotenv.config();
        this.searchCommands = new SearchCommands();
    }

    init () {

        if(this.result.error) 
            throw result.error
        
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}`);
        });

        this.client.on('reconnecting', () => {
            console.log(`Reconnecting in as ${this.client.user.tag}`);
        });

        this.client.on('disconnect', () => {
            console.log(`Disconnect in as ${this.client.user.tag}`);
        });

        this.client.on('message', async msg => {
            if(msg.author.bot) 
                return;
            if (!msg.content.startsWith(process.env.PREFIX_MESSAGE))
                return;
            this.processMessage(msg);
        });

        this.client.login(process.env.TOKEN_BOT_DISCORD);
    }

    processMessage (msg) 
    {
        if(msg.content.startsWith(`${process.env.PREFIX_MESSAGE}ls`)) {
            this.searchCommands.searchListYoutube(msg);
        } else {
            msg.channel.send("You need to enter a valid command!");
        }
    }
    
}

export default DiscordClient;