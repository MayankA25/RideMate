import {
  CirclePlus,
  Copy,
  Dot,
  Ellipsis,
  MessageCircleOff,
  Pen,
  Reply,
  ReplyAll,
  Trash,
  Triangle,
} from "lucide-react";
import React, { useRef } from "react";
import { useState } from "react";
import MoreInfo from "../MoreInfo/MoreInfo";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useChatStore from "../../store/useChatStore";
import EditMessageModal from "../EditMessageModal/EditMessageModal";
import { useAuthStore } from "../../store/useAuthStore";
import DeleteMessageModal from "../DeleteMessageModal/DeleteMessageModal";

export default function MessageBox({ message, number, sender, index }) {
  const [hover, setHover] = useState(false);

  const navigate = useNavigate();

  const params = useParams();

  console.log("Ride Id: ", params.id);

  const {
    setReplyToMessage,
    setSelectedReplyMessageIndex,
    selectedReplyMessageIndex,
    messages
  } = useChatStore();
  const { user } = useAuthStore();

  useEffect(()=>{
    if(selectedReplyMessageIndex != null){
      document.getElementById(`message_${selectedReplyMessageIndex}`)?.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [selectedReplyMessageIndex]);

  const checkIfSenderIsNull = (messageId)=>{
    const tempMessages = [...messages];
    const foundIndex = tempMessages.findIndex((message, index)=>{
      return message._id == messageId
    })

    return !tempMessages[foundIndex]?.sender ? null : tempMessages[foundIndex].sender;
  }

  return (
    <div
      id={`message_${index}`}
      className={`chat ${
        number % 2 == 0 ? "chat-start px-4" : "chat-end"
      }  transition-all duration-300 relative`}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
    >
      <div
        className={`flex items-center bg-primary/20 h-[115%] absolute left-0 w-[110%] ${
          index == selectedReplyMessageIndex ? "opacity-100" : "opacity-0"
        } transition-all duration-300`}
      ></div>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full cursor-pointer" onClick={()=>{
          if(!message.sender) return;
          navigate(`/account/${message.sender._id}`)
        }}>
          {sender != "Deleted User" ? (<img
            alt="Tailwind CSS chat bubble component"
            src={sender.profilePic}
            className={`${message.isDeleted ? "grayscale-100" : ""}`}
          />) : (
            <div className="flex items-center justify-center rounded-full bg-gray-500 h-full">
              <span className="font-bold">D</span>
            </div>
          )}
        </div>
      </div>
      <div className="chat-header mb-1">
        {sender != "Deleted User" ? `${sender.firstName} ${sender.lastName}` : sender}
        <time className="text-xs opacity-50">
          {`${new Date(message.createdAt).getHours()}`.padStart(2, "0")}:
          {`${new Date(message.createdAt).getMinutes()}`.padStart(2, "0")}
        </time>
      </div>
      <div
        className={`flex items-center gap-2 relative ${
          number % 2 != 0 ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`chat-bubble ${
            number % 2 != 0 ? (message.isDeleted ? "bg-neutral-600" : "chat-bubble-primary") : (message.isDeleted ? "bg-gray-600" : "")
          }`}
        >
          <div className="flex flex-col justify-center gap-3">
            {(message.parentId && !message.isDeleted) && (
              <div
                className={`flex items-center relative ${
                  number % 2 != 0 ? "bg-indigo-400" : "bg-base-100"
                } p-2 rounded-lg cursor-pointer`}
                onClick={() => {
                  setSelectedReplyMessageIndex(message.parentId._id);
                  setTimeout(() => {
                    setSelectedReplyMessageIndex(null);
                  }, 1000);
                }}
              >
                <div className="flex flex-col justify-center mx-4 gap-2">
                  <h1
                    className={`font-bold text-shadow-lg ${
                      number % 2 != 0 ? `${message.parentId.isDeleted ? "text-neutral-300" : ""}` : `${message.parentId.isDeleted ? "text-neutral-300" : "text-indigo-300" }`
                    }`}
                  >
                    {(!!message.parentSenderName && checkIfSenderIsNull(message.parentId._id)) ? (message.parentId.sender == user._id
                      ? "You"
                      : message.parentSenderName) : "Deleted User"}
                  </h1>
                  <h1
                    className={`font-bold ${
                      number % 2 != 0 ? "text-white/85" : "text-white"
                    }`}
                  >
                    {message.parentId.text}
                  </h1>
                </div>
                <div
                  className={`flex h-full absolute ${
                    (number % 2 != 0 ? `${message.parentId.isDeleted ? "bg-white/60" : "bg-neutral/80"}` : `${message.parentId.isDeleted ? "bg-neutral-600" : "bg-indigo-500"}`)
                  } p-1 rounded-l-lg left-0`}
                ></div>
              </div>
            )}
            <h1 className="font-bold">{message.isDeleted ? <span className="flex items-center gap-3"><MessageCircleOff strokeWidth={4}/> {`This Message Was Deleted`}</span> : <span>{message.text}</span>}</h1>
          </div>
        </div>
        {message.sender && <EditMessageModal
          messageId={message._id}
          messageText={message.text}
          rideId={params.id}
        />}
        {message.sender && <DeleteMessageModal
          messageId={message._id}
          messageText={message.text}
          rideId={params.id}
        />}
        {message.sender && <span
          className={`dropdown ${index < 2 ? "dropdown-bottom" : "dropdown-top"}
          }`}
        >
          <Ellipsis
            tabIndex={0}
            role="button"
            className={`${
              hover ? "text-white/60 hover:text-white opacity-100" : "opacity-0"
            } size-5 cursor-pointer`}
          />
          <ul
            tabIndex="-1"
            className="dropdown-content menu bg-base-200 rounded-box w-52 p-2 shadow-sm"
          >
            {message.sender && <li
              onClick={() => {
                setReplyToMessage(message);
              }}
            >
              <a className="text-white/50 hover:text-white">
                <Reply className="size-4" />
                Reply
              </a>
            </li>}
            <li
              onClick={(e) => {
                navigator.clipboard.writeText(message.text);
                toast.success("Text Copied");
              }}
            >
              <a className="text-white/50 hover:text-white">
                <Copy className="size-4" />
                Copy
              </a>
            </li>
            {sender._id == user._id && (
              <li
                onClick={() => {
                  document
                    .getElementById(`my_edit_message_modal_${message._id}`)
                    .showModal();
                }}
              >
                <a className="text-white/50 hover:text-white">
                  <Pen className="size-4" />
                  Edit
                </a>
              </li>
            )}
            {sender._id == user._id && (
              <li
                onClick={() => {
                  document
                    .getElementById(`my_delete_message_modal_${message._id}`)
                    .showModal();
                }}
              >
                <a className="text-white/50 hover:text-white">
                  <Trash className="size-4" />
                  Delete
                </a>
              </li>
            )}
          </ul>
        </span>}
      </div>
    </div>
  );
}
