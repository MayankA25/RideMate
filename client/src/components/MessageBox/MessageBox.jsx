import { CirclePlus, Dot, Ellipsis, Reply, Triangle } from "lucide-react";
import React from "react";
import { useState } from "react";
import MoreInfo from "../MoreInfo/MoreInfo";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function MessageBox({ text, number }) {
  const [hover, setHover] = useState(false);
  
  return (
    <div
      className={`chat ${number % 2 == 0 ? "chat-start" : "chat-end"}`}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
          />
        </div>
      </div>
      <div className="chat-header mb-1">
        Obi-Wan Kenobi
        <time className="text-xs opacity-50">12:45</time>
      </div>
      <div
        className={`flex items-center gap-2 ${
          number % 2 != 0 ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`chat-bubble ${
            number % 2 != 0 ? "chat-bubble-primary" : ""
          }`}
        >
          {text}
        </div>
        <div className={`dropdown ${number%2 != 0 ? "dropdown-left" : "dropdown-right"}`}>
          <Ellipsis tabIndex={0} role="button" className={`${hover ? "text-white/60 hover:text-white" : "hidden"} size-5 cursor-pointer`}/>
          <ul
            tabIndex="-1"
            className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li onClick={(e)=>{
                navigator.clipboard.writeText(text);
                toast.success("Text Copied")
            }}>
              <a>Copy</a>
            </li>
            <li>
              <a>Edit</a>
            </li>
            <li>
              <a>Show Replies</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
