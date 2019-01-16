# discord-reddit-feed-bot

Forked to update some stuff that needed updating, and added stuff for use on glitch.com. Also, made it embed the images instead of thumbnails for link posts as I wanted to output images to discord. And added support for multiple feeds from subreddits to multiple channels. 

### Json variables:

Variable | Description
-------- | -----------
`glitch` | Whether the code is running on glitch.com or not
`token` | The discord bot's token. [This is a nice guide.](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
`subToIds` | An array of objects for each feed. The object has a few variables in the next table.

- **subToIds variables**(configured for each sub)

Variable | Description
-------- | -----------
slug | The slug of the subreddit or multireddit to take from. For example, the slug for /r/askreddit would be `r/askreddit`
channelID | The ID of the discord channel to send posts to.
delay | How long to wait before sending a post to discord. Defaults at 60. Is useful to give people time to mark their posts as NSFW, and wait for the reddit preview image to load.
nsfw | A boolean for whether to show NSFW images or not. Defaults to true. If not, the embed will instead show a description saying the post is NSFW.
spoilers | A boolean for whether to show posts marked as spoiler or not. Defaults to true. If not, the text or image will not be displayed and instead be marked as a spoiler.
color | The color of the embed. Defaults to `#036393F`, which is the same color as the embed.![example](https://i.imgur.com/RucygrK.png)
