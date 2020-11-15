import discord from 'discord.js';
import dotenv from 'dotenv';
import ytdl from 'ytdl-core';

const client = new discord.Client();
const result = dotenv.config();
const queue = new Map();

if(result.error) {
    throw result.error
}

client.once("ready", () => {
    console.log("Ready!");
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnect!");
});

client.on('message', msg => {
    if(msg.author.bot) return;
    if (!msg.content.startsWith(process.env.PREFIX_MESSAGE)) return;

    const serverQueue = queue.get(msg.guild.id);

    if(msg.content.startsWith(`${process.env.PREFIX_MESSAGE}play`)) {
        execute(msg, serverQueue);
        return;
    }
});

async function execute(message, serverQueue) {
    const args =  message.content.split(" ");
    const voiceChannel = message.member.voice.channel;
    if(!voiceChannel){
        return message.channel.send("You need to be in a voice channel to play music!");
    }
    
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if(!permissions.has("CONNECT") || !permissions.has("SPEAK")){
        return message.channel.send("I need the permissions to join and speak in your voice channel!");
    }
    console.log(args[1]);
    const songInfo = await ytdl.getInfo('https://www.youtube.com/watch?v=kXI2ln5w-hY');
    
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };
    console.log(song);
    if(!serverQueue){

        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);
        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (error) {
            console.log(error);
            queue.delete(message.guild.id);
            return message.channel.send(error);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if(!song){
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    } 

    const dispacher = serverQueue.connection
    .play(ytdl(song.url))
    .on('finish', () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    })
    .on('error', error => {
        console.log(error);
    })
    dispacher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

  
client.login(process.env.TOKEN_BOT_DISCORD);