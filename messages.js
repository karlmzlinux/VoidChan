const container = document.getElementById("messagesContainer");
const postBtn = document.getElementById("postGlobal");

async function loadMessages() {
  const res = await fetch("/.netlify/functions/getMessages");
  const messages = await res.json();
  container.innerHTML = messages
    .map(
      (m) => `
        <div class="bg-[#0f172a] p-4 rounded-lg border border-[#1f2937]">
          <h3 class="text-[#00ffae] font-semibold">${m.user || "Anon"}:</h3>
          <p>${m.text}</p>
          <span class="text-xs text-gray-500">${m.date}</span>
        </div>`
    )
    .join("");
}

async function postMessage() {
  const text = prompt("Escribe tu mensaje global:");
  if (!text) return;
  await fetch("/.netlify/functions/postMessage", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  loadMessages();
}

postBtn.addEventListener("click", postMessage);
loadMessages();
