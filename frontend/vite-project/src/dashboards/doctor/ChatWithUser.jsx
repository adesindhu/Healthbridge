import { motion } from "framer-motion";
import { useState } from "react";

export default function ChatWithUser() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "patient", text: "Hello Doctor!" },
    { id: 2, sender: "doctor", text: "Hi! How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "doctor", text: input }]);
    setInput("");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative p-6"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-emerald-900/70 to-teal-900/80"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-white">Live Chat</h1>
          <p className="text-green-100">Chat with your patients in real-time</p>
        </motion.div>

        {/* Chat Box */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.sender === "doctor"
                  ? "bg-green-200 self-end"
                  : "bg-gray-200 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
