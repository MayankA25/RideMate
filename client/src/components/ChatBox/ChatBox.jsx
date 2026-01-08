import { Send, X } from "lucide-react";
import React, { useRef } from "react";
import { useState } from "react";
import useChatStore from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useParams } from "react-router-dom";

export default function ChatBox() {
  const { sendMessage, selectedGroup, replyToMessage, setReplyToMessage, reply, gettingGroup, gettingMessages } = useChatStore();

  const { user } = useAuthStore();

  const [senderMessage, setSenderMessage] = useState("");

  const ref = useRef(null);

  const params = useParams();

  return (
    <div className="flex items-center sticky bottom-0">
      <div className="flex items-end gap-3 px-5 w-full bg-base-100 py-5">
        <div className="flex flex-col justify-center w-full">
          {replyToMessage && <div className="flex items-center bg-base-300 px-4 py-3 rounded-t-xl rounded-b-3xl relative">
            <div className="flex items-center bg-base-200 py-2 w-full relative rounded-xl">
              <div className="flex items-center bg-primary absolute top-0 p-1 rounded-l-xl h-full"></div>
              <div className="flex flex-col mx-6 gap-2">
                <h1 className="font-bold text-indigo-300">{
                  user._id == replyToMessage.sender._id ? "You" : `${replyToMessage.sender.firstName} ${replyToMessage.sender.lastName}`}</h1>
                <h1 className="font-bold">{replyToMessage.text}</h1>
              </div>
            </div>
            <div className="flex items-center justify-center bg-white/10 p-1 rounded-full absolute top-0 right-0 transform -translate-y-[50%] translate-x-[50%] cursor-pointer" onClick={()=>{
              setReplyToMessage(null);
            }}>
              <X className="size-3.5"/>
            </div>
          </div>}
          <input
            type="text"
            className={`${(gettingGroup || gettingMessages) ? "skeleton py-3" : "input input-primary px-4 py-5"} focus:outline-0 rounded-full focus:bg-base-200 w-full `}
            placeholder={(gettingGroup || gettingMessages) ? "" : "Type Your Message"}
            value={senderMessage}
            onChange={(e) => {
              if(gettingGroup || gettingMessages) return;
              console.log("Text: ", e.target.value);
              setSenderMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                ref.current.click();
              }
            }}
          />
        </div>
        <div
          ref={ref}
          className={`flex items-center justify-center  p-3 ${(gettingGroup || gettingMessages) ? "skeleton p-5" : "bg-primary rounded-md cursor-pointer hover:bg-primary/80 transition-all"}`}
          onClick={() => {
            replyToMessage ? reply(user._id, selectedGroup._id, senderMessage, params.id) :
            sendMessage(user._id, selectedGroup._id, senderMessage, params.id);
            setSenderMessage("");
            setReplyToMessage(null);
          }}
        >
          {!(gettingGroup || gettingMessages) && <Send className="size-4" />}
        </div>
      </div>
    </div>
  );
}
