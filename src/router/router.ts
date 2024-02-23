import axios from "axios";
import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import nacl from "tweetnacl";
import handleInteraction from "../redirector";
import { registerCommand } from "../command-creator";
import redirector from "../redirector";

dotenv.config();

const mainRouter = Router();

mainRouter.get("/welcome", (req: Request, res: Response) => {
  try {
    res.status(200).send("codeGPT says: is all good man?");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});
const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

mainRouter.post("/event", (req: Request, res: Response) => {
  try {
    console.log("Entró a event");
    const signature = req.headers["x-signature-ed25519"];
    const timestamp = req.headers["x-signature-timestamp"];
    const body = JSON.stringify(req.body);

    // Asegúrate de que tanto signature como timestamp son strings
    if (typeof signature !== "string" || typeof timestamp !== "string") {
      return res.status(401).end("Invalid request signature");
    }

    // Asegúrate de que PUBLIC_KEY está definida y es un string
    if (!PUBLIC_KEY) {
      throw new Error("Public key is not defined");
    }

    // Verifica la firma
    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, "hex"),
      Buffer.from(PUBLIC_KEY, "hex")
    );

    if (!isVerified) {
      return res.status(401).end("Invalid request signature");
    }

    // Verifica si el evento es un PING de Discord
    if (req.body && req.body.type === 1) {
      console.log("Received PING from Discord");
      // Responde con un PONG ACK (type: 1)
      return res.status(200).json({ type: 1 });
    }

    // Aquí manejarías otros tipos de eventos de interacción
    redirector(req.body, res);
    // Envía una respuesta  genérica para otros eventos
  } catch (error: any) {
    console.error("Error handling event", error);
    res.status(400).send(error.message);
  }
});

mainRouter.get("/createCommand", (req: Request, res: Response) => {
  try {
    registerCommand();
    res.status(200).send("creado comando");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

export default mainRouter;
