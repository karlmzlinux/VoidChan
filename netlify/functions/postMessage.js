import { promises as fs } from "fs";

export async function handler(event) {
  const body = JSON.parse(event.body || "{}");
  const newMessage = {
    user: "Anon",
    text: body.text || "",
    date: new Date().toLocaleString(),
  };

  let messages = [];
  try {
    const data = await fs.readFile("./messages.json", "utf8");
    messages = JSON.parse(data);
  } catch {}

  messages.push(newMessage);
  await fs.writeFile("./messages.json", JSON.stringify(messages, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
}

