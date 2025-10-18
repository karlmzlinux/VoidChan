import { promises as fs } from "fs";

export async function handler() {
  try {
    const data = await fs.readFile("./messages.json", "utf8");
    return {
      statusCode: 200,
      body: data,
    };
  } catch {
    return {
      statusCode: 200,
      body: "[]",
    };
  }
}
