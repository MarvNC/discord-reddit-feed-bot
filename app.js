const Discord = require('discord.js');
const request = require('request');
const entities = require('entities');
const validUrl = require('valid-url');
const config = require('./config.json');

const client = new Discord.Client();


//glitch
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


//delete above part if not using glitch

client.login(config.token);

let botReady = false;

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}`)
    botReady = true;
});

config.subToIds.forEach((sub) => {
    let subredditUrl = `https://www.reddit.com/${sub.slug}/new.json?limit=10`;
    //console.log(subredditUrl)
    let lastTimestamp = Math.floor(Date.now() / 1000);
    setInterval(() => {
        if (botReady) {
            request({
                url: subredditUrl,
                json: true,
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    //console.log('Request succeeded, lastTimestamp = ', lastTimestamp);

                    for (const post of body.data.children.reverse()) {
                        if (lastTimestamp <= post.data.created_utc) {
                            //waits delay or 60sec for preview to show up on reddit
                            if (Math.floor(Date.now() / 1000) - ((sub.delay > -1) ? sub.delay : 60) >= post.data.created_utc) {
                                //console.log('grabbing post');
                                lastTimestamp = post.data.created_utc;

                                let thumbnail;
                                let isThumbnail = false;
                                if (post.data.preview) {
                                    thumbnail = entities.decodeHTML(post.data.preview.images[0].source.url);
                                } else {
                                    isThumbnail = true;
                                    thumbnail = post.data.thumbnail
                                }

                                const embed = new Discord.RichEmbed();
                                embed.setColor(sub.color ? sub.color : 0x036393F); // set color from config or default
                                embed.setTitle(`${entities.decodeHTML(post.data.title.length > 250 ? post.data.title.slice(0, 250).concat('...') : post.data.title)}`);
                                embed.setURL(`https://redd.it/${post.data.id}`);
                                embed.setDescription(post.data.is_self ? entities.decodeHTML(post.data.selftext.length > 1000 ? post.data.selftext.slice(0, 1000).concat('...') : post.data.selftext) : '');
                                //if its nsfw or spoiler and the sub is configured to suppress nsfw or spoilers then dont send image
                                if((post.data.over_18 ? (sub.nsfw !== null ? !sub.nsfw : false) : false) || (post.data.spoiler ? (sub.spoiler !== null ? !sub.spoiler : false) : false)){
                                    if(!post.data.is_self){
                                        embed.setDescription('Link post marked as NSFW/spoilers.');
                                    } else if(post.data.spoiler && sub.spoiler !== null ? !sub.spoiler : false){
                                        // remove text if spoiler and sub is configured to suppress spoilers
                                        embed.setDescription('Text post marked as spoilers.')
                                    }
                                } else {
                                    if (post.data.preview) {
                                        embed.setImage(entities.decodeHTML(post.data.preview.images[0].source.url));
                                    } else {
                                        embed.setThumbnail(validUrl.isWebUri(post.data.thumbnail) ? post.data.thumbnail : null);
                                    }
                                }

                                embed.setFooter(`/u/${post.data.author} in /r/${post.data.subreddit}`);
                                embed.setTimestamp(new Date(post.data.created_utc * 1000));

                                client.channels.get(sub.channelID).send('', embed).then(() => {
                                    //console.log(`Sent message for new post https://redd.it/${post.data.id}`);
                                }).catch(err => {
                                    console.log(err);//console.error(embed, err);
                                });
                            }
                        }
                    }
                    ++lastTimestamp;
                } else {
                    //console.warn('Request failed - reddit could be down or subreddit doesn\'t exist. Will continue.');
                    //console.log(response, body);
                }
            });
        }
    }, 3 * 1000); // checks for new posts every 30 seconds
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
