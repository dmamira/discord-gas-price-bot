// Response for Uptime Robot
const http = require("http");
const fetch = require("node-fetch");
http
  .createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Discord bot is active now \n");
  })
  .listen(3000);

// Discord bot implements
const Discord = require("discord.js");
const client = new Discord.Client();
let interval;
client.on("ready", async () => {
  const guild = client.guilds.cache.get(process.env.DISCORD_CHANNEL_ID);
  const bot = await guild.members.fetch(process.env.DISCORD_BOT_ID);
  interval = setInterval(async () => {
    const res = await fetch(
      `https://ethgasstation.info/api/ethgasAPI.json?api-key=${process.env.DEFI_PULSE_API_KEY}`
    );
    const json = await res.json();
    const average = Number(json.average) / 10;
    const fast = Number(json.fast) / 10;
    const low = Number(json.safeLow) / 10;
    await client.user.setActivity(`slow:${low}gwei fast:${fast}gwei `);
    await bot.setNickname(`${average} gwei`);
  }, 1000 * 60);
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("please set ENV: DISCORD_BOT_TOKEN");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);

