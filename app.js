if(glitch){
    const express = require('express')
    const app = express()
    app.use(express.static('public'))
    const listener = app.listen(process.env.PORT, () => {
        console.log(`Your app is listening on port ${listener.address().port}`)
    })

    const http = require('http');
    app.get("/", (request, response) => {
        response.sendStatus(200);
    });
    setInterval(() => {
        http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);

    'use strict';

    require('dotenv').config();
}

//glitch over

const Discord = require('discord.js');
const request = require('request');
const entities = require('entities');
const validUrl = require('valid-url');
const config = require('./config.json');

const client = new Discord.Client();

client.login(config.token);

let botReady = false;

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}`)
    botReady = true;
});

config.subToIds.forEach((pair) => {
    let subredditUrl = `https://www.reddit.com/${pair[0]}/new.json?limit=10`;
    let lastTimestamp = Math.floor(Date.now() / 1000);
    setInterval(() => {
        if (botReady) {
            request({
                url: subredditUrl,
                json: true,
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    //console.debug('Request succeeded, lastTimestamp = ', lastTimestamp);
                    for (const post of body.data.children.reverse()) {
                        if (lastTimestamp <= post.data.created_utc) {
                            //waits 60sec for preview to show up on reddit
                            if (Math.floor(Date.now() / 1000) - 60 >= post.data.created_utc) {
                                //console.log('grabbing post');
                                lastTimestamp = post.data.created_utc;

                                const embed = new Discord.RichEmbed();
                                embed.setColor(0x036393F);
                                embed.setTitle(`${entities.decodeHTML(post.data.title)}`);
                                embed.setURL(`https://redd.it/${post.data.id}`);
                                embed.setDescription(`${post.data.is_self ? entities.decodeHTML(post.data.selftext.length > 1000 ? post.data.selftext.slice(0, 1000).concat('...') : post.data.selftext) : ''}`);
                                if (post.data.preview) {
                                    embed.setImage(entities.decodeHTML(post.data.preview.images[0].source.url));
                                } else {
                                    embed.setThumbnail(validUrl.isWebUri(post.data.thumbnail) ? post.data.thumbnail : null);
                                }
                                embed.setFooter(`/u/${post.data.author} in /r/${post.data.subreddit}`);
                                embed.setTimestamp(new Date(post.data.created_utc * 1000));

                                client.channels.get(pair[1]).send('', embed).then(() => {
                                    //console.debug(`Sent message for new post https://redd.it/${post.data.id}`);
                                }).catch(err => {
                                    console.error(embed, err);
                                });
                            }
                        }
                    }
                    ++lastTimestamp;
                } else {
                    //logger.warn('Request failed - reddit could be down or subreddit doesn\'t exist. Will continue.');
                    console.debug(response, body);
                }
            });
        }
    }, 30 * 1000); // 30 seconds
});

client.on('error', (error) => {
    console.log(error.message);
    setTimeout(() => {
        console.log('Reconnecting');
        client.login(config.token);
    }, 5000);
});

client.on('reconnecting', () => {
    console.log('reconnecting');
});
