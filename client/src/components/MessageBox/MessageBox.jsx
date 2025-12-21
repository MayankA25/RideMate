import { CirclePlus, Copy, Dot, Ellipsis, Pen, Reply, ReplyAll, Trash, Triangle } from "lucide-react";
import React from "react";
import { useState } from "react";
import MoreInfo from "../MoreInfo/MoreInfo";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useChatStore from "../../store/useChatStore";
import EditMessageModal from "../EditMessageModal/EditMessageModal";
import { useAuthStore } from "../../store/useAuthStore";

export default function MessageBox({ message, number, sender }) {
  const [hover, setHover] = useState(false);

  const params = useParams();

  console.log("Ride Id: ", params.id);

  const { setReplyToMessage } = useChatStore();
  const { user } = useAuthStore();
  
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
            src={sender.profilePic}
          />
        </div>
      </div>
      <div className="chat-header mb-1">
        {sender.firstName} {sender.lastName}
        <time className="text-xs opacity-50">{`${new Date(message.createdAt).getHours()}`.padStart(2, "0")}:{`${new Date(message.createdAt).getMinutes()}`.padStart(2, "0")}</time>
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
          {message.text}
        </div>
        <EditMessageModal messageId={message._id} messageText={message.text} rideId={params.id}/>
        <span className={`dropdown ${number%2 != 0 ? "dropdown-left" : "dropdown-right"}`}>
          <Ellipsis tabIndex={0} role="button" className={`${hover ? "text-white/60 hover:text-white" : "hidden"} size-5 cursor-pointer`}/>
          <ul
            tabIndex="-1"
            className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li onClick={()=>{
              setReplyToMessage(message);
            }}>
              <a className="text-white/50 hover:text-white"><Reply className="size-4"/>Reply</a>
            </li>
            <li onClick={(e)=>{
                navigator.clipboard.writeText(message.text);
                toast.success("Text Copied")
            }}>
              <a className="text-white/50 hover:text-white"><Copy className="size-4"/>Copy</a>
            </li>
            {sender._id == user._id && <li onClick={()=>{
              document.getElementById(`my_edit_message_modal_${message._id}`).showModal()
            }}>
              <a className="text-white/50 hover:text-white"><Pen className="size-4"/>Edit</a>
            </li>}
            {sender._id == user._id && <li>
              <a className="text-white/50 hover:text-white"><Trash className="size-4"/>Delete</a>
            </li>}
          </ul>
        </span>
      </div>
    </div>
  );
}
