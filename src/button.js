import React, { useState, useEffect } from "react";

const Buttons = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([{ text: "How can I help you?", sender: "bot" }]);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWhatsApp(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const halfway = window.innerHeight / 2;
      setShowBackToTop(window.scrollY > halfway);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSendMessage = () => {
    const trimmed = userMessage.trim();

    if (trimmed !== "") {
      setMessages([...messages, { text: trimmed, sender: "user" }]);

      // Redirect to WhatsApp
      const encodedMessage = encodeURIComponent(trimmed);
      const whatsappURL = `https://wa.me/918000920222?text=${encodedMessage}`;
      const newTab = window.open(whatsappURL, "_blank", "noopener,noreferrer");

      if (!newTab) {
        alert("Please allow popups for this site to continue to WhatsApp.");
      }

      setUserMessage(""); // Reset input field
    } else {
      alert("Please type a message.");
    }
  };


  return (
    <div>
      {/* WhatsApp Button */}
      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-500 transform ${
          showWhatsApp ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-green-600 transition-transform duration-300"
        >
          {/* Replace with actual WhatsApp icon */}
          💬
        </button>
      </div>

      {/* WhatsApp Chat Box */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-20 bg-white shadow-lg border border-gray-300 rounded-lg w-64 p-4 z-50 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">Chat Support</h3>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-gray-800">✖</button>
          </div>

          <div className="h-40 overflow-y-auto border rounded p-2 bg-gray-100">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 p-2 rounded ${msg.sender === "bot" ? "bg-gray-200 text-gray-800" : "bg-cyan-500 text-white text-right"}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="mt-2 flex">
            <input
              type="text"
              className="flex-1 border rounded p-2 text-sm"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-3 py-2 rounded ml-2"
              onClick={handleSendMessage}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Back-to-Top Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-cyan-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-cyan-600 transition-transform duration-300"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default Buttons;
