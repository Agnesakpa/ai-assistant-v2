const API_KEY = "";  // Replace with your actual key

const context = `
You are a helpful assistant for a product called Fire Stick from Oshanodes.

Product Information:
- Fire Stick is a candle that kills mosquitoes.
- Its scent is safe for humans but deadly to mosquitoes.
- It starts working within 5 minutes after being lit.
- It costs 20 Naira per stick.
- It can be distributed nationwide in Nigeria.

Answer questions based on this information only. Be polite, short, and clear.
`;

async function sendMessage() {
  const input = document.getElementById("user-input");
  const output = document.getElementById("chat-output");

  const userMessage = input.value.trim();
  if (!userMessage) return;

  output.innerHTML += `<div class="message user">You: ${userMessage}</div>`;
  input.value = "";

  output.innerHTML += `<div class="message bot">Oshanodes Assistant: <em>Typing...</em></div>`;
  output.scrollTop = output.scrollHeight;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: context },
          { role: "user", content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.5
      })
    });

    const data = await res.json();

    // Remove loading message
    const loadingMsg = document.querySelector(".bot:last-child");
    if (loadingMsg) loadingMsg.remove();

    if (data.choices && data.choices[0]) {
      const reply = data.choices[0].message.content.trim();
      output.innerHTML += `<div class="message bot">Oshanodes Assistant: ${reply}</div>`;
    } else {
      output.innerHTML += `<div class="message bot">Oshanodes Assistant: Something went wrong. Try again later.</div>`;
      console.error("OpenAI response error:", data);
    }

    output.scrollTop = output.scrollHeight;

  } catch (error) {
    output.innerHTML += `<div class="message bot">Oshanodes Assistant: Error: ${error.message}</div>`;
    console.error("Fetch error:", error);
  }
}
document.getElementById("user-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});