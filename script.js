// ==================== VOIDCHAN MAIN SCRIPT ====================
// 🔥 Desarrollado por KarlDev 2025 🔥

// 🌍 Traducciones
const translations = {
  en: { title: "VOIDCHAN Boards", msgPlaceholder: "Write your message...", post: "Post", dark: "Dark Mode" },
  es: { title: "Foros de VOIDCHAN", msgPlaceholder: "Escribe tu mensaje...", post: "Publicar", dark: "Modo Oscuro" },
  de: { title: "VOIDCHAN-Foren", msgPlaceholder: "Schreib deine Nachricht...", post: "Posten", dark: "Dunkelmodus" },
  fr: { title: "Forums de VOIDCHAN", msgPlaceholder: "Écris ton message...", post: "Publier", dark: "Mode Sombre" },
};

// 🌑 Modo oscuro activable
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

// 🌐 Cambiar idioma dinámicamente
const langSelector = document.getElementById("langSelector");
langSelector.addEventListener("change", () => {
  const lang = langSelector.value;
  document.getElementById("siteTitle").textContent = translations[lang].title;
  document.getElementById("message").placeholder = translations[lang].msgPlaceholder;
  document.getElementById("postBtn").textContent = translations[lang].post;
  themeToggle.textContent = translations[lang].dark;
});

// 💬 Sistema de mensajes globales (Netlify Functions)
const msgForm = document.getElementById("msgForm");
const msgList = document.getElementById("messages");

async function loadMessages() {
  try {
    const res = await fetch("/.netlify/functions/getMessages");
    const msgs = await res.json();
    msgList.innerHTML = "";
    msgs.reverse().forEach((m) => {
      const div = document.createElement("div");
      div.classList.add("msg");
      div.textContent = `> ${m.text}`;
      msgList.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading messages:", err);
  }
}

msgForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("message").value.trim();
  if (!msg) return;
  try {
    await fetch("/.netlify/functions/postMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: msg }),
    });
    document.getElementById("message").value = "";
    loadMessages();
  } catch (err) {
    console.error("Error posting message:", err);
  }
});

loadMessages();

// 🎮 Módulo de minijuegos
function setupClickGame() {
  let score = 0;
  const btn = document.getElementById("clickBtn");
  const scoreEl = document.getElementById("clickScore");
  const recordEl = document.getElementById("clickRecord");

  const record = localStorage.getItem("clickRecord") || 0;
  recordEl.textContent = record;

  btn.addEventListener("click", () => {
    score++;
    scoreEl.textContent = score;
    if (score > record) {
      localStorage.setItem("clickRecord", score);
      recordEl.textContent = score;
    }
  });
}

function setupReactionGame() {
  const btn = document.getElementById("reactionBtn");
  const status = document.getElementById("reactionStatus");
  const recordEl = document.getElementById("reactionRecord");

  let startTime = null;
  let record = localStorage.getItem("reactionRecord") || 9999;

  btn.addEventListener("click", () => {
    if (!startTime) {
      status.textContent = "Wait for green...";
      status.style.color = "#f00";
      setTimeout(() => {
        status.textContent = "CLICK!";
        status.style.color = "lime";
        startTime = Date.now();
      }, Math.random() * 3000 + 1000);
    } else {
      const time = (Date.now() - startTime) / 1000;
      status.textContent = `Your reaction: ${time}s`;
      status.style.color = "#fff";
      startTime = null;

      if (time < record) {
        record = time;
        localStorage.setItem("reactionRecord", record);
        recordEl.textContent = record;
      }
    }
  });
}

function setupTypingGame() {
  const textDisplay = document.getElementById("typingText");
  const input = document.getElementById("typingInput");
  const result = document.getElementById("typingResult");
  const recordEl = document.getElementById("typingRecord");

  const phrases = ["VoidChan rocks!", "Anonymous forever", "The board awakens", "Coding in the void"];
  const record = localStorage.getItem("typingRecord") || 9999;
  recordEl.textContent = record;

  let currentText = "";
  let start = null;

  function newRound() {
    currentText = phrases[Math.floor(Math.random() * phrases.length)];
    textDisplay.textContent = currentText;
    input.value = "";
    result.textContent = "";
  }

  input.addEventListener("input", () => {
    if (!start) start = Date.now();
    if (input.value === currentText) {
      const time = ((Date.now() - start) / 1000).toFixed(2);
      result.textContent = `Done in ${time}s`;
      if (time < record) {
        localStorage.setItem("typingRecord", time);
        recordEl.textContent = time;
      }
      start = null;
      setTimeout(newRound, 1000);
    }
  });

  newRound();
}

// Inicializar juegos
setupClickGame();
setupReactionGame();
setupTypingGame();

// ⚡️ Mensaje inicial
console.log("🚀 VOIDCHAN Loaded — By KarlDev 2025");

