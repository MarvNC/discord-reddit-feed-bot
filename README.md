# discord-reddit-feed-bot

Forked from to update some stuff that needed updating because of discord.js changing, and added my own code for use of glitch.com. Also, added features of my own.

Added:
- embed images instead of thumbnails for link posts
- Multiple subreddit feeds to different channels
- Supress NSFW and/or spoiler posts' contents from being sent to discord
- Set the delay to wait before sending a post
- glitch.com timeout prevention

### Json variables:

Variable | Description
-------- | -----------
`glitch` | Whether the code is running on glitch.com or not
`token` | The discord bot's token. [This is a nice guide.](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
`subToIds` | An array of objects for each sub feed. The object has a few variables in the next table.

- **subToIds variables**(configured for each sub feed)

Variable | Description
-------- | -----------
`slug` | The slug of the subreddit or multireddit to take from. For example, the slug for /r/askreddit would be `r/askreddit`
`channelID` | The ID of the discord channel to send posts to.
`delay` | Optional. How long to wait before sending a post to discord. Defaults at 60. Is useful to give people time to mark their posts as NSFW, and wait for the reddit preview image to load.
`nsfw` | A boolean for whether to show NSFW images or not. If suppressed, the embed will instead show a description saying the post is NSFW.
`spoiler` | A boolean for whether to show posts marked as spoiler or not. If suppressed, the text or image will not be displayed and instead be marked as a spoiler.
`color` | Optional. The color of the embed. Defaults to `#036393F`, which is the same color as the embed.![example](https://i.imgur.com/RucygrK.png)
