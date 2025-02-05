"use client";
import React from "react";
import { useState } from "react";
import axiosInstance from "@/services/endpoint";
import { IoIosSend } from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import { BsPersonFill } from "react-icons/bs";


export default function Home() {
  const [Chats, setChats] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [res] = await axiosInstance.post(
        "/chat",
        { message: inputValue },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log(res);
      console.log(res.data);
      setChats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen fixed w-full bg-gray-700 flex justify-center ">
      <div className="overflow-auto no-scrollbar">
        <header className="bg-red-300 w-full  h-20">Hello</header>
        <div className="bg-gray-900 overflow-auto  w-[900px]">
          <div className="flex flex-col-reverse space-y-4 p-2 ">
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
