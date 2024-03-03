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
    res.status(200).send("welcome to pilibot");
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

mainRouter.get("/discord-callback", async (req: Request, res: Response) => {
  try {
    console.log("Te llamaron", req.query.code);
    const code = req.query.code; // Captura el código de autorización
    if (typeof code !== "string") {
      return res.status(400).send("Authorization code is missing or invalid");
    }

    // Crea una instancia de URLSearchParams con los parámetros necesarios
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_APPLICATION_ID as string,
      client_secret: process.env.DISCORD_CLIENT_SECRET as string,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: `https://cf72-181-63-144-178.ngrok-free.app/discord-callback`,
      scope: "identify", // Asegúrate de incluir todos los scopes necesarios aquí
    });

    // Intercambia el código por un token de acceso
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Token response", tokenResponse);
    // trabajas acá con la db y el registro del token.

    // acá rediriges al front nuevamente. Quizá le avisa al front que haga una petición para que actualice la conexión.
    res.redirect("/welcome");
  } catch (error: any) {
    console.error("Error in /discord-callback", error);
    res.status(500).send(error.message);
  }
});

export default mainRouter;
