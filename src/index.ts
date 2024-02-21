import dotenv from "dotenv";
import {
  AttachmentBuilder,
  ChannelType,
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
} from "discord.js";
import { completions } from "./codegpt/codegpt"; // Asegúrate de que este módulo sea compatible con TypeScript

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.on("ready", () => {
  console.log("bot is online");
});

const CHANNELS: string[] = [process.env.DISCORD_CHANNEL_ID as string]; // add your Channel IDs

client.on("messageCreate", async (message) => {
  console.log("Escuchado", message);
  if (message.author.bot) return;
  if (message.content.startsWith("!")) return;
  // if(message.author.id === '') return // to ignore some user
  if (!client.user) return;
  if (
    !CHANNELS.includes(message.channelId) &&
    !message.mentions.users.has(client.user.id)
  )
    return;

  await message.channel.sendTyping();
  const sendTypingInterval = setInterval(() => {
    message.channel.sendTyping();
  }, 5000);

  // Define the message
  let conversation: { role: string; content: string }[] = [];
  let prevMessages = await message.channel.messages.fetch({ limit: 4 });
  prevMessages = prevMessages.reverse();

  prevMessages.forEach((msg) => {
    if (msg.author.bot && msg.author.id !== client.user?.id) return;
    if (msg.content.startsWith("!")) return;
    // if(msg.author.id === '') // to ignore some user in memory

    // assistant
    if (msg.author.id === client.user?.id) {
      conversation.push({
        role: "assistant",
        content: msg.content,
      });
      return;
    }
    // user
    conversation.push({
      role: "user",
      content: msg.content,
    });
  });

  const agentId = process.env.CODEGPT_AGENT_ID as string;
  const res = await completions(conversation, agentId);

  console.log(res); // show the final response

  clearInterval(sendTypingInterval);

  if (!res) {
    message.reply("Ups! Agent Error");
    return;
  }

  message.reply(res);
});

client.login(process.env.DISCORD_TOKEN as string);
