import {
  CirclePlus,
  Copy,
  Dot,
  Ellipsis,
  Pen,
  Reply,
  ReplyAll,
  Trash,
  Triangle,
} from "lucide-react";
import React from "react";
import { useState } from "react";
import MoreInfo from "../MoreInfo/MoreInfo";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useChatStore from "../../store/useChatStore";
import EditMessageModal from "../EditMessageModal/EditMessageModal";
import { useAuthStore } from "../../store/useAuthStore";
import DeleteMessageModal from "../DeleteMessageModal/DeleteMessageModal";

export default function MessageBox({ message, number, sender, index }) {
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
            number % 2 != 0 ? "chat-bubble-primary" : ""
          }`}
        >
          <div className="flex flex-col justify-center gap-3">
            {message.parentId && <div
              className={`flex items-center relative ${
                number % 2 != 0 ? "bg-indigo-400" : "bg-base-100"
              } p-2 rounded-lg`}
            >
              <div className="flex flex-col justify-center mx-4 gap-2">
                <h1 className="font-bold">{ message.parentId.sender == user._id ? "You" : message.parentSenderName }</h1>
                <h1
                  className={`font-bold ${
                    number % 2 != 0 ? "text-white" : "text-white"
                  }`}
                >
                  {message.parentId.text}
                </h1>
              </div>
              <div
                className={`flex h-full absolute ${
                  number % 2 != 0 ? "bg-neutral/80" : "bg-indigo-500"
                } p-1 rounded-l-lg left-0`}
              ></div>
            </div>}
            <h1 className="font-bold">{message.text}</h1>
          </div>
        </div>
        <EditMessageModal
          messageId={message._id}
          messageText={message.text}
          rideId={params.id}
        />
        <DeleteMessageModal
          messageId={message._id}
          messageText={message.text}
          rideId={params.id}
        />
        <span
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
            <li
              onClick={() => {
                setReplyToMessage(message);
              }}
            >
              <a className="text-white/50 hover:text-white">
                <Reply className="size-4" />
                Reply
              </a>
            </li>
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
        </span>
      </div>
    </div>
  );
}
