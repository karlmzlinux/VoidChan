// Netlify Function para guardar mensajes
import { promises as fs } from "fs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const newMsg = JSON.parse(event.body);
    const filePath = "./messages.json";
    const data = JSON.parse(await fs.readFile(filePath, "utf8"));
    data.push({
      text: newMsg.text,
      time: new Date().toISOString(),
    });

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Error saving" }) };
  }
}
