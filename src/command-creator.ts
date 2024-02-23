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
    name: "resumencanal",
    description:
      "Obtiene los mensajes de un canal desde una fecha y hora específicas",
    options: [
      {
        type: 3, // Tipo 3 corresponde a STRING
        name: "fecha",
        description:
          "La fecha desde la cual obtener los mensajes (formato YYYY-MM-DD)",
        required: true,
      },
      {
        type: 3, // Tipo 3 corresponde a STRING
        name: "hora",
        description:
          "La hora desde la cual obtener los mensajes (formato HH:MM)",
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
