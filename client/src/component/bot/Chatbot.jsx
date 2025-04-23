import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { FaComments } from "react-icons/fa";
import { AiOutlineSend, AiOutlineClose } from "react-icons/ai"; 

const socket = io("https://product-fetch-backend.onrender.com");

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket.on("botMessage", (response) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: response },
      ]);
    });

    return () => {
      socket.off("botMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message },
      ]);
      socket.emit("userMessage", message);
      setMessage("");
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: "9999",
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            fontSize: "19px",
            cursor: "pointer",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
          }}
        >
          {isOpen ? <AiOutlineClose /> : <FaComments />} 
        </button>
      </div>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            zIndex: "9999",
          }}
        >
          <div
            style={{
              padding: "10px",
              fontWeight: "bold",
              backgroundColor: "#4CAF50",
              color: "#fff",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              textAlign: "center",
            }}
          >
            Course Assistant
          </div>

          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: msg.sender === "user" ? "#dcf8c6" : "#eee",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #ccc",
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "4px 10px",
              }}
            >
              <AiOutlineSend size={13} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
