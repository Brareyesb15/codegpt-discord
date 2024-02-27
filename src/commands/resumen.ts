import { Response } from "express";
import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { completions } from "../codegpt/codegpt";

dotenv.config();

const agent = process.env.CODEGPT_AGENT_ID;

export async function handleResumenCanalCommand(
  body: any,
  response: Response,
  rest: REST,
  CLIENT_ID: string | undefined
) {
  try {
    // Extrae la fecha, la hora y el ID del canal del cuerpo de la interacción
    const fecha = body.data.options.find(
      (opt: any) => opt.name === "fecha"
    ).value;
    const hora = body.data.options.find(
      (opt: any) => opt.name === "hora"
    ).value;
    const channelId = body.channel_id;

    // Convierte la fecha y la hora a un objeto Date de JavaScript
    const fechaHora = new Date(`${fecha}T${hora}:00Z`); // Asume que la hora está en UTC

    // Recupera los mensajes del canal desde la fecha y hora especificadas
    const mensajes = await obtenerMensajesDesde(rest, channelId, fechaHora);

    // Llama a la función "resumidor" con los mensajes recuperados
    const resumen = await resumidor(mensajes);

    // Envía el resumen como respuesta al usuario
    await rest.post(Routes.webhook(CLIENT_ID as string, body.token), {
      body: { content: resumen },
    });

    response.status(200).send("Resumen enviado");
  } catch (error) {
    console.error("Error al procesar el comando:", error);
    response.status(400).send("Error al procesar el comando");
  }
}
async function obtenerMensajesDesde(
  rest: REST,
  channelId: string,
  fechaHora: Date
): Promise<any[]> {
  try {
    let mensajes: any[] = [];
    let ultimoId: string | null = null;
    let todosMensajesRecuperados = false;

    while (!todosMensajesRecuperados) {
      const params: any = { limit: 100 };
      if (ultimoId) {
        params.before = ultimoId; // Usamos 'before' para obtener mensajes anteriores
      }

      const data: any = await rest.get(Routes.channelMessages(channelId), {
        query: params,
      });
      console.log("while", data.length);

      if (data.length === 0 || data.length < params.limit) {
        // No hay más mensajes en el canal o hemos recuperado menos mensajes que el límite
        todosMensajesRecuperados = true;
        const mensajesFiltrados = data.filter(
          (mensaje: any) => new Date(mensaje.timestamp) >= fechaHora
        );
        mensajes = mensajes.concat(mensajesFiltrados);
        console.log("1");
      } else {
        console.log("2");
        ultimoId = data[data.length - 1].id;
        const mensajesFiltrados = data.filter(
          (mensaje: any) => new Date(mensaje.timestamp) >= fechaHora
        );
        console.log("mensajes", mensajes.length);
        mensajes = mensajes.concat(mensajesFiltrados);

        // Si el último mensaje es igual o anterior a la fechaHora, detiene la búsqueda
        if (new Date(data[data.length - 1].timestamp) < fechaHora) {
          todosMensajesRecuperados = true;
        }
      }
    }
    console.log("mensajes", mensajes.length);
    if (mensajes.length === 0) {
      console.log("No hay mensajes desde la fecha dada.");
      return [];
    } else {
      console.log("Mensajes recuperados:", mensajes);
      return mensajes;
    }
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    throw error;
  }
}

async function resumidor(mensajes: any[]): Promise<string> {
  try {
    let resumen: string = "";

    // Invierte el orden del array para empezar por el mensaje más viejo
    mensajes.reverse().forEach((mensaje) => {
      // Verifica si el mensaje proviene de un usuario (no de una aplicación o bot)
      if (!mensaje.author.bot) {
        const nombreAutor: string = mensaje.author.username;
        const hora: string = new Date(mensaje.timestamp).toLocaleTimeString(); // Convierte la marca de tiempo a hora local
        const contenido: string = mensaje.content || ""; // Si no hay contenido, asigna una cadena vacía

        // Agrega la información del mensaje al resumen
        resumen += `${nombreAutor} (${hora}): ${contenido}\n`;
      }
    });

    const message = [
      {
        role: "user",
        content: `Haz un resumen de esta conversación: ${resumen}. Si no recibes nada de info ahí, responde que no hay conversaciones para la fecha requerida`,
      },
    ];
    return await completions(message, agent as string);
  } catch (error) {
    console.error("Error en la función resumidor:", error);
    throw error;
  }
}
