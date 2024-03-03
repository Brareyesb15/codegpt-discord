// handleInteraction.ts
import { Response } from "express";
import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { handleChatCommand } from "./commands/chat";
import { handleResumenCanalCommand } from "./commands/resumen";

dotenv.config();

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_APPLICATION_ID;

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN as string);

export default async function redirector(body: any, response: Response) {
  try {
    // Envía una respuesta de reconocimiento a Discord
    await rest.post(Routes.interactionCallback(body.id, body.token), {
      body: {
        type: 5, // Tipo 5 corresponde a ACK with source
      },
    });

    // Redireccionador de comandos
    switch (body.data.name) {
      case "chat":
        await handleChatCommand(body, response, rest, CLIENT_ID);
        break;
      // case "resumencanal":
      //   await handleResumenCanalCommand(body, response, rest, CLIENT_ID);
      //   break;
      default:
        console.error("Comando no reconocido");
        response.status(400).send("Comando no reconocido");
        break;
    }
  } catch (error) {
    console.error("Error en el redirector:", error);
    response.status(500).send("Error interno del servidor");
  }
}
