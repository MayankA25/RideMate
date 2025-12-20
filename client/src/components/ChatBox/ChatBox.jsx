import { Send } from "lucide-react";
import React, { useRef } from "react";
import { useState } from "react";
import useChatStore from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useParams } from "react-router-dom";

export default function ChatBox() {

  const { sendMessage, selectedGroup } = useChatStore();

  const { user } = useAuthStore();
  
  const [senderMessage, setSenderMessage] = useState('');

  const ref = useRef(null);

  const params = useParams();

  return (
    <div className="flex items-center sticky bottom-0">
      <div className="flex items-center gap-3 px-5 w-full bg-base-100 py-5">
        <input
          type="text"
          className="input input-primary focus:outline-0 rounded-full focus:bg-base-200 w-full px-4 py-5"
          placeholder="Type Your Message"
          value={senderMessage}
          onChange={(e)=>{
            console.log("Text: ", e.target.value);
            setSenderMessage(e.target.value);
          }}
          onKeyDown={(e)=>{
            if(e.key == "Enter"){
              ref.current.click();
            }
          }}
        />
        <div ref={ref} className="flex items-center justify-center bg-primary p-3 rounded-md cursor-pointer hover:bg-primary/80 transition-all" onClick={()=>{
          sendMessage(user._id, selectedGroup._id, senderMessage, params.id)
        }}>
          <Send className="size-4" />
        </div>
      </div>
    </div>
  );
}
