import { Send } from "lucide-react";
import React from "react";
import { useState } from "react";

export default function ChatBox() {
  const [senderMessage, setSenderMessage] = useState('');
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
        />
        <div className="flex items-center justify-center bg-primary p-3 rounded-md cursor-pointer hover:bg-primary/80 transition-all" onClick={()=>{
          
        }}>
          <Send className="size-4" />
        </div>
      </div>
    </div>
  );
}
