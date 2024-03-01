import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DISCORD_API_URL = "https://discord.com/api";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Reemplaza con el token de tu bot
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID; // Reemplaza con el ID de tu aplicación
const COMMAND_NAME = "resumencanal";
// const GUILD_ID = "TU_GUILD_ID"; // Reemplaza con el ID de tu servidor, si quieres un comando de servidor

export async function registerCommand() {
  try {
    // Obtener la lista de comandos registrados
    const commandsResponse = await axios.get(
      `${DISCORD_API_URL}/applications/${APPLICATION_ID}/commands`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      }
    );

    // Buscar el comando por nombre para obtener su ID
    const command = commandsResponse.data.find(
      (cmd: any) => cmd.name === COMMAND_NAME
    );
    if (!command) {
      throw new Error(`Comando con nombre "${COMMAND_NAME}" no encontrado.`);
    }

    // Eliminar el comando usando su ID
    await axios.delete(
      `${DISCORD_API_URL}/applications/${APPLICATION_ID}/commands/${command.id}`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      }
    );

    console.log(`Comando con nombre "${COMMAND_NAME}" eliminado.`);
  } catch (error) {
    console.error("Error al eliminar el comando por nombre:", error);
  }
}
