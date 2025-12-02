const form = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");
const micBtn = document.getElementById("mic-btn");

let currentAudio = null;

// 🎤 Voice Input (Speech to Text)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognizer = new SpeechRecognition();
recognizer.lang = "en-US";

micBtn.addEventListener("click", () => {
  recognizer.start();
  micBtn.textContent = "🎙️ Listening...";
});

recognizer.onresult = (event) => {
  document.getElementById("message").value = event.results[0][0].transcript;
  micBtn.textContent = "🎤 Speak";
};

recognizer.onend = () => {
  micBtn.textContent = "🎤 Speak";
};

// 📨 Send to backend
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value;
  const image = document.getElementById("image").files[0];

  const formData = new FormData();
  formData.append("message", message);
  if (image) formData.append("image", image);

  addMessage(`You: ${message}`);

  const res = await fetch("/chat", { method: "POST", body: formData });
  const data = await res.json();

  // 🟢 Add bot message with Play / Stop
  const botMsg = document.createElement("p");
  botMsg.innerHTML = `
      Bot: ${data.reply}<br>
      <button class="play-btn">🔊 Play Voice</button>
      <button class="stop-btn">⏹ Stop Voice</button>
  `;
  chatBox.appendChild(botMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // 🔊 Voice controls
  const playButton = botMsg.querySelector(".play-btn");
  const stopButton = botMsg.querySelector(".stop-btn");

  playButton.addEventListener("click", () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(data.audio);
    currentAudio.play();
  });

  stopButton.addEventListener("click", () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  });

  document.getElementById("message").value = "";
  document.getElementById("image").value = "";
});

function addMessage(text) {
  const msg = document.createElement("p");
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
