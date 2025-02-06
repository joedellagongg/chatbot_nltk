"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/services/endpoint";
import { IoIosSend } from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import { BsPersonFill } from "react-icons/bs";

export default function Home() {
  const [Chats, setChats] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const initialGreeting = {
      id: Date.now(),
      response: "Hi I'am TroubleTech! How can I assist you today?",
      sender: "bot",
    };

    setChats([initialGreeting]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      response: inputValue,
      sender: "user",
    };
    setChats((prevChats) => {
      const updatedChats = [...prevChats, userMessage];
      localStorage.setItem("chatMessages", JSON.stringify(updatedChats));
      return updatedChats;
    });

    setIsTyping(true);

    try {
      const res = await axiosInstance.post("/chat", { message: inputValue });

      setTimeout(() => {
        const formattedResponse = res.data.response
          .replace(/### (.*?)\n/g, "<h3>$1</h3>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/\n/g, "<br/>");

        const botMessage = {
          id: Date.now() + 1,
          response: formattedResponse,
          sender: "bot",
        };

        setChats((prevChats) => {
          const updatedChats = [...prevChats, botMessage];
          localStorage.setItem("chatMessages", JSON.stringify(updatedChats));
          return updatedChats;
        });

        setIsTyping(false);

        setInputValue("");
      }, 500);
    } catch (error) {
      const botMesage = {
        id: Date.now() + 1,
        response: "Network Error! Please Try Again",
        sender: "bot",
      };
      setChats((prevChats) => {
        const updatedChats = [...prevChats, botMesage];
        localStorage.setItem("chatMessages", JSON.stringify(updatedChats));
        return updatedChats;
      });
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen fixed w-full bg-gray-700 flex justify-center">
      <div className="overflow-auto no-scrollbar h-full">
        <header className=" bg-gray-900 text-white w-full h-[10%] p-6 text-3xl font-bold">
          TroubleTech
        </header>
        <div className="bg-gray-900 h-[90%] overflow-auto no-scrollbar flex flex-col-reverse w-[900px]">
          <div className="flex flex-col space-y-4 p-2 pb-40">
            {Chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex ${
                  chat.sender === "user" ? "flex-row-reverse" : "flex-row"
                } m-2`}
              >
                {chat.sender === "user" ? (
                  <BsPersonFill
                    className="h-10 w-10 m-2 border-2 border-solid bg-white flex items-center justify-center rounded-full"
                    size={20}
                  />
                ) : (
                  <FaRobot
                    className="h-10 w-10 m-2 border-2 border-solid bg-white flex items-center justify-center rounded-full"
                    size={20}
                  />
                )}

                <div
                  className={`max-w-[600px] p-2 items-center overflow-auto rounded-md ${
                    chat.sender === "user"
                      ? "bg-slate-500 text-white"
                      : "bg-green-300 text-black"
                  }`}
                  dangerouslySetInnerHTML={{ __html: chat.response }}
                ></div>
              </div>
            ))}

            {isTyping && (
              <div className="flex m-2">
                <FaRobot
                  className="h-10 w-10 m-2 border-2 border-solid bg-white flex items-center justify-center rounded-full"
                  size={20}
                />
                <div className="max-w-[600px] p-2 flex items-center text-white rounded-md">
                  <div className="flex flex-row gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="h-[80px] bottom-5 rounded-md fixed bg-black flex items-center justify-center"
      >
        <input
          className="w-[500px] pl-5 m-5 h-[40px] rounded-full"
          value={inputValue}
          autoFocus={true}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="h-10 w-10 m-5 ml-0 bg-white rounded-full flex justify-center items-center"
        >
          <IoIosSend size={24} />
        </button>
      </form>
    </div>
  );
}
