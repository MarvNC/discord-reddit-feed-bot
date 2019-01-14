# discord-reddit-feed-bot

Forked and updated some stuff that needed updating, and added stuff for use on glitch.com. Also, made it embed the images instead of thumbnails for link posts as I wanted to output images to discord. And added support for multiple subreddits to multiple channels. 

### Json variables:

Variable | Description
-------- | -----------
`glitch` | whether the code is running on glitch.com or not
`token` | the discord bot's token. [This is a good guide.](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
`subToIds` | an array of arrays with 2 values in each of them. First is the slug, then the ID of the discord channel to send posts from that slug to.
