import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DISCORD_API_URL = "https://discord.com/api";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Reemplaza con el token de tu bot
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID; // Reemplaza con el ID de tu aplicación
// const GUILD_ID = "TU_GUILD_ID"; // Reemplaza con el ID de tu servidor, si quieres un comando de servidor

export async function registerCommand() {
  console.log("entramos a registrar", BOT_TOKEN, APPLICATION_ID);
  const commandData = {
    name: "chat",
    description: "Registra un mensaje y obtiene una respuesta",
    options: [
      {
        type: 3, // Tipo 3 corresponde a STRING
        name: "mensaje",
        description: "El mensaje que quieres registrar",
        required: true,
      },
    ],
  };

  try {
    const response = await axios.post(
      `${DISCORD_API_URL}/applications/${APPLICATION_ID}/commands`,
      commandData,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      }
    );

    console.log("Comando registrado:", response.data);
  } catch (error) {
    console.error("Error al registrar el comando:", error);
  }
}
