import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Assalomu alaykum! Men Forex AI ustozman 📈 Savolingizni yozing." }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Sen Forex trading bo‘yicha o‘zbek tilida oddiy tushuntiradigan ustozsan.",
            },
            ...newMessages,
          ],
        }),
      });

      const data = await res.json();

      const reply =
        data.choices?.[0]?.message?.content ||
        "Xatolik yuz berdi 😕";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Server xatosi 😕" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>📈 Forex AI Ustoz</h2>

      <div style={{ height: 400, overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{m.role === "user" ? "Siz" : "AI"}:</b> {m.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Savol yozing..."
        style={{ width: "80%", padding: 10, marginTop: 10 }}
      />

      <button onClick={sendMessage} disabled={loading} style={{ padding: 10 }}>
        {loading ? "Yuborilmoqda..." : "Yuborish"}
      </button>
    </div>
  );
}
