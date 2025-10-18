// ====== VOIDCHAN SCRIPT ======

// 🌍 Traducciones
const translations = {
  en: { title: "VOIDCHAN Boards", msgPlaceholder: "Write your message...", post: "Post", dark: "Dark Mode" },
  es: { title: "Foros de VOIDCHAN", msgPlaceholder: "Escribe tu mensaje...", post: "Publicar", dark: "Modo Oscuro" },
  de: { title: "VOIDCHAN-Foren", msgPlaceholder: "Schreib deine Nachricht...", post: "Posten", dark: "Dunkelmodus" },
  fr: { title: "Forums de VOIDCHAN", msgPlaceholder: "Écris ton message...", post: "Publier", dark: "Mode Sombre" },
};

// 🌑 Modo Oscuro
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// 🌐 Selector de idioma
const langSelector = document.getElementById("langSelector");
langSelector.addEventListener("change", () => {
  const lang = langSelector.value;
  document.getElementById("siteTitle").textContent = translations[lang].title;
  document.getElementById("message").placeholder = translations[lang].msgPlaceholder;
  document.getElementById("postBtn").textContent = translations[lang].post;
});

// 💬 Mensajes globales
const msgForm = document.getElementById("msgForm");
const msgList = document.getElementById("messages");

function loadMessages() {
  const saved = JSON.parse(localStorage.getItem("voidchanMsgs")) || [];
  msgList.innerHTML = "";
  saved.forEach(m => {
    const div = document.createElement("div");
    div.textContent = `> ${m}`;
    msgList.appendChild(div);
  });
}

msgForm.addEventListener("submit", e => {
  e.preventDefault();
  const msg = document.getElementById("message").value.trim();
  if (msg) {
    const saved = JSON.parse(localStorage.getItem("voidchanMsgs")) || [];
    saved.push(msg);
    localStorage.setItem("voidchanMsgs", JSON.stringify(saved));
    document.getElementById("message").value = "";
    loadMessages();
  }
});

loadMessages();

// 🎮 Minijuegos
function setupClickGame() {
  let score = 0;
  const btn = document.getElementById("clickBtn");
  const scoreEl = document.getElementById("clickScore");

  btn.addEventListener("click", () => {
    score++;
    scoreEl.textContent = score;
    localStorage.setItem("voidclickRecord", Math.max(score, localStorage.getItem("voidclickRecord") || 0));
  });
}

function setupReactionGame() {
  const btn = document.getElementById("reactionBtn");
  const status = document.getElementById("reactionStatus");
  let startTime = null;

  btn.addEventListener("click", () => {
    if (!startTime) {
      status.textContent = "Wait for green...";
      setTimeout(() => {
        status.textContent = "CLICK!";
        status.style.color = "lime";
        startTime = Date.now();
      }, Math.random() * 3000 + 1000);
    } else {
      const time = (Date.now() - startTime) / 1000;
      status.textContent = `Your reaction: ${time}s`;
      startTime = null;
      status.style.color = "#fff";
    }
  });
}

setupClickGame();
setupReactionGame();
