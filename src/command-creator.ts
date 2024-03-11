import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DISCORD_API_URL = "https://discord.com/api";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;

let COMMAND_NAME = ["ask", "channel summary"];

export async function registerCommand() {
  // Get the list of registered commands
  const commandsResponse = await axios.get(
    `${DISCORD_API_URL}/applications/${APPLICATION_ID}/commands`,
    {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    }
  );

  COMMAND_NAME.forEach(async (commandName) => {
    // Find the command by name to get its ID
    const command = commandsResponse.data.find(
      (cmd: any) => cmd.name === commandName
    );

    if (!command) {
      try {
        console.error(
          `Command with name "${commandName}" not found, creating now...`
        );
        await axios.put(
          `${DISCORD_API_URL}/applications/${APPLICATION_ID}/commands`,
          {
            name: commandName,
            // Add more command properties like description, options here
            description: "",
            options: [],
          },
          {
            headers: {
              Authorization: `Bot ${BOT_TOKEN}`,
            },
          }
        );
        console.log(`Command with name "${commandName}" created.`);
      } catch (error) {
        console.error(`Error creating the command "${commandName}":`, error);
      }
    }
  });
}
