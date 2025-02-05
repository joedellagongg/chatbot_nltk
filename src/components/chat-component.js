"use client";
import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "@/services/endpoint";
import { IoIosSend } from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import { BsPersonFill } from "react-icons/bs";
// import { faker } from "@faker-js/faker";

// const Chats = [
//   { id: 1, response: "We need to back up the online AI microchip!" },
//   { id: 2, response: "Try bypassing the capacitor, that should work!" },
//   { id: 1, response: "I'll reboot the server and see if it stabilizes." },
//   { id: 2, response: "Great, let me monitor the network logs!" },
//   { id: 1, response: "The database query is running slow, any ideas?" },
//   { id: 2, response: "Check if there’s an index on the search column!" },
//   { id: 1, response: "That worked! The query time dropped by half!" },
//   { id: 2, response: "Awesome! Let’s push the update to production." },
// ];

//   console.log(Chats);

// const Chats = Array.from({ length: 100 }, (_, index) => ({
//   id: index % 2 === 0 ? 1 : 2,
//   message: faker.hacker.phrase(),
// }));

// const handleSubmit = async () => {
//   try {
//     const res = await axiosInstance.post("/chat", []);
//     console.log(res);
//   } catch (error) {
//     console.error(error);
//   }
// };

export default function Home() {
  const [Chats, setChats] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // 🔹 Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem("chatMessages");
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  // 🔹 Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(Chats));
  }, [Chats]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 🔹 Append user message first
    const userMessage = { id: 1, response: inputValue };
    setChats((prevChats) => {
      const updatedChats = [...prevChats, userMessage];
      localStorage.setItem("chatMessages", JSON.stringify(updatedChats));
      return updatedChats;
    });

    try {
      const res = await axiosInstance.post("/chat", { message: inputValue });

      // 🔹 Append bot response after receiving the response
      const botMessage = { id: 2, response: res.data.response };

      setChats((prevChats) => {
        const updatedChats = [...prevChats, botMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updatedChats));
        return updatedChats;
      });

      setInputValue(""); // Clear input field
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="h-screen fixed w-full bg-gray-700 flex justify-center ">
      <div className="overflow-auto no-scrollbar">
        <header className="bg-red-300 w-full  h-20">Hello</header>
        <div className="bg-gray-900 overflow-auto  w-[900px]">
          <div className="flex flex-col space-y-4 p-2 ">
            {Chats.map((chat) => (
              <div
                key={chat.response}
                className={`flex ${
                  chat.id === 1 ? "flex-row-reverse" : "flex-row"
                } m-2`}
              >
                {chat.id === 1 ? (
                  <BsPersonFill
                    className="h-10 w-10 m-2  border-2 border-solid bg-white flex items-center justify-center rounded-full"
                    size={20}
                  />
                ) : (
                  <FaRobot
                    className="h-10 w-10 m-2 border-2 border-solid bg-white flex items-center justify-center rounded-full"
                    size={20}
                  />
                )}
                <div
                  className={`max-w-[600px] p-2 overflow-auto rounded-md ${
                    chat.id === 1
                      ? "bg-slate-500 text-white"
                      : "bg-green-500 text-black"
                  }`}
                >
                  {chat.response}
                </div>
              </div>
            ))}
            {""}
          </div>
          <div className=" h-[120px]" />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="h-[80px] bottom-5 rounded-md fixed bg-black flex items-center justify-center"
      >
        <input
          className="w-[500px] pl-5 m-5 h-[40px] rounded-full"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="h-10 w-10 m-5 bg-white rounded-full flex justify-center items-center"
        >
          <IoIosSend size={24} />
        </button>
      </form>
    </div>
  );
}
