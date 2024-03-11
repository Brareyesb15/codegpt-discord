import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DISCORD_API_URL = "https://discord.com/api";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;

export async function registerCommand() {
  try {
    let result = "";
    result = await registerChatCommand();
    result = result + (await registerSummaryCommand());

    return result;
  } catch (error) {
    console.error(`Error creating the commands "":`, error);
  }
}

export async function registerChatCommand() {
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

    return `comando chat registrado`;
  } catch (error) {
    return "commando chat no se pudo registrar";
  }
}

export async function registerSummaryCommand() {
  console.log("entramos a registrar summary", BOT_TOKEN, APPLICATION_ID);
  const commandData = {
    name: "channelSummary",
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

    return `comando channel summary registrado`;
  } catch (error: any) {
    console.log(error);
    return "comando channel Summary no se pudo registrar";
  }
}
