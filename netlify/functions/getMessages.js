// Netlify Function para obtener los mensajes
import { promises as fs } from "fs";

export async function handler() {
  try {
    const data = await fs.readFile("./messages.json", "utf8");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error reading messages" })
    };
  }
}
