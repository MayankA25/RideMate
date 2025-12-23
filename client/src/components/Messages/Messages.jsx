import React, { useRef } from "react";
import MessageBox from "../MessageBox/MessageBox";
import useChatStore from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";

export default function Messages() {
  const {
    messages,
    subscribeToGroupMessages,
    unsubscribeToGroupMessages,
    getMessages,
    selectedGroup,
  } = useChatStore();
  const { user } = useAuthStore();

  const ref = useRef(null);

  useEffect(() => {
    subscribeToGroupMessages();
    return () => {
      unsubscribeToGroupMessages();
    };
  }, []);

  useEffect(() => {
    getMessages(selectedGroup._id);
  }, [selectedGroup]);

  useEffect(()=>{
    ref.current.scrollIntoView();
  }, [messages])

  return (
    <div
      className="flex flex-col gap-3 py-3 px-5 h-[83.5%] overflow-y-scroll overflow-hidden scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent transition-all duration-200"
    >
      {messages.map((message, index) => {
        return (
          <MessageBox
            key={index}
            message={message}
            number={message.sender._id == user._id ? 1 : 0}
            index={index}
            sender={message.sender}
          />
        );
      })}
      <div ref={ref}></div>
    </div>
  );
}
