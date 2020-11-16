
import yts from 'yt-search';
import { MessageEmbed } from 'discord.js';
import dotenv from 'dotenv';

class SearchCommands{
    
    constructor() {
        this.result = dotenv.config();
    }

    searchListYoutube(msg) {

        if(this.result.error) 
            throw result.error

        const search =  msg.content.replace(`${process.env.PREFIX_MESSAGE}ls`,'');
        if(search){
            let options = { query: search };
            yts(options, async (error, result) => {
                if(error){
                    msg.channel.send(`Error \n Description ${error}`);
                    return;
                }
                let resultsEmbed = new MessageEmbed().setColor('#FFF952');
                if(result.videos && result.videos.length > 0) {
                    result.videos.map((video, index) => {
                        if(index <= 4){
                            resultsEmbed.addField(
                                `**${index + 1})** ${video.title}`,
                                `Duration __${video.timestamp}__\nAuthor __${video.author.name}__`
                            );
                        }
                    });
                    let resultMessage = await msg.channel.send(resultsEmbed);
                    msg.channel.activeCollector = true;
                    const response = await msg.channel.awaitMessages(this.filter, { max: 1, time: 30000, errors: ["time"] });
                    const reply = response.first().content;
                    
                    if(reply.includes(",")) {
                        let songs = reply.split(",").map((str) => str.trim());
                        for(let song of songs) {
                            const choice = result.videos[parseInt(song) - 1];
                        }
                    }
                    else {
                        const choice = result.videos[parseInt(reply) - 1];
                    }
                    msg.channel.activeCollector = false;
                } else {
                    msg.channel.send(`No results were found for your ridiculous search! ${msg.author}`);
                }
            });
        }
        else {
            msg.channel.send(`The command is not valid, you are a rookie! ${msg.author}`);
        }
    }

    filter(msg) {
        const pattern = /^[0-5]{1}(\s*,\s*[0-5]{1})*$/g;
        return pattern.test(msg.content);
    }
}

export default SearchCommands;