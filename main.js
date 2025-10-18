// Conexión a Supabase
const SUPABASE_URL = "https://hyoqobgkjmvnjwfpkmyv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5b3FvYmdram12bmp3ZnBrbXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzQ5MzIsImV4cCI6MjA3NjMxMDkzMn0.iTCBoaZOWF5jAyYa3tas4XjtZLAtPpoBrJEod-xSWC4";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const boardSelector = document.getElementById("boardSelector");
const threadForm = document.getElementById("threadForm");
const threadList = document.getElementById("threadList");

let currentBoard = boardSelector.value;

boardSelector.addEventListener("change", async () => {
  currentBoard = boardSelector.value;
  await loadThreads();
});

threadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value || "Anon";
  const message = document.getElementById("message").value;

  const { error } = await supabase.from("threads").insert([{ username, message, board: currentBoard }]);
  if (error) {
    console.error("Error publicando hilo:", error);
    alert("Error publicando hilo. Intenta de nuevo.");
  } else {
    document.getElementById("message").value = "";
    await loadThreads();
  }
});

async function loadThreads() {
  const { data, error } = await supabase.from("threads").select("*").eq("board", currentBoard).order("id", { ascending: false });
  if (error) {
    console.error("Error cargando hilos:", error);
    threadList.innerHTML = "Error cargando hilos.";
    return;
  }

  if (!data.length) {
    threadList.innerHTML = "No hay hilos aún. ¡Sé el primero!";
    return;
  }

  threadList.innerHTML = data.map(thread => `
    <div class="thread">
      <strong>${thread.username}</strong> dice:
      <p>${thread.message}</p>
      <small>📌 Board: ${thread.board}</small>
    </div>
  `).join("");
}

loadThreads();
