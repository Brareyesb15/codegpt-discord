// handleChatCommand.ts
import { Response } from "express";
import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { completions } from "../codegpt/codegpt";

dotenv.config();

export async function handleChatCommand(
  body: any,
  response: Response,
  rest: REST,
  CLIENT_ID: string | undefined
) {
  try {
    const conversation = [
      {
        role: "user",
        content: body.data.options[0].value,
      },
    ];

    const agentId = process.env.CODEGPT_AGENT_ID as string;
    const res = await completions(conversation, agentId);

    if (!res) {
      return response.status(200).send("No response generated");
    }

    await rest.post(Routes.webhook(CLIENT_ID as string, body.token), {
      body: { content: res },
    });
    response.status(200).send("Message sent");
  } catch (error) {
    console.error("Error sending message", error);
    response.status(400).send("Failed to send message");
  }
}
