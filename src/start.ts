import dotenv from "dotenv";
import express, { Request, Response } from "express";
import nacl from "tweetnacl";
import { REST, Routes } from "discord.js";
import { completions } from "./codegpt/codegpt"; // Asegúrate de que este módulo sea compatible con TypeScript

dotenv.config();

const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY; // Define tu clave pública de Discord
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // El token de tu bot
const CLIENT_ID = process.env.DISCORD_APPLICATION_ID; // El ID de tu aplicación

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN as string);

export default async function handleInteraction(body: any, response: Response) {
  console.log("body on interaction", body.data.options);

  // Envía una respuesta de reconocimiento a Discord
  await rest.post(Routes.interactionCallback(body.id, body.token), {
    body: {
      type: 5, // Tipo 5 corresponde a ACK with source
    },
  });

  const conversation = [
    {
      role: "user",
      content: body.data.options[0].value, // Accede al primer elemento del array options y luego a su propiedad value
    },
  ];

  const agentId = process.env.CODEGPT_AGENT_ID as string;
  const res = await completions(conversation, agentId);

  if (!res) {
    // Maneja el caso de que no haya respuesta
    return response.status(200).send("No response generated");
  }

  // Envía la respuesta del agente a Discord
  console.log(CLIENT_ID, " client y body", body.token);
  try {
    // Asegúrate de que estás utilizando la URL correcta para enviar el mensaje de seguimiento
    await rest.post(Routes.webhook(CLIENT_ID as string, body.token), {
      body: { content: res },
    });
    response.status(200).send("Message sent");
  } catch (error) {
    console.error("Error sending message", error);
    response.status(400).send("Failed to send message");
  }
}
