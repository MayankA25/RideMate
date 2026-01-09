import React, { useRef } from "react";
import MessageBox from "../MessageBox/MessageBox";
import useChatStore from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";
import MessageBoxSkeleton from "../MessageBoxSkeleton/MessageBoxSkeleton";

export default function Messages() {
  const {
    messages,
    subscribeToGroupMessages,
    unsubscribeToGroupMessages,
    getMessages,
    selectedGroup,
    gettingMessages,
    gettingGroup
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
    getMessages(selectedGroup?._id);
  }, [selectedGroup]);

  useEffect(()=>{
    ref.current.scrollIntoView();
  }, [messages])


  return (
    <div
      className={`flex flex-col gap-3 py-3 px-5 h-[83.5%] overflow-hidden scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent transition-all duration-200 ${(gettingGroup || gettingMessages) ? "overflow-y-hidden" : "overflow-y-scroll"}`}
    >
      {(gettingMessages || gettingGroup) ? 
      [...Array(10)].map((_, index)=>{
        return (
          <MessageBoxSkeleton key={index} index={index}/>
        )
      })
       :
       messages.map((message, index) => {
        return (
          <MessageBox
            key={index}
            message={message}
            number={(message.sender && message.sender._id == user._id) ? 1 : 0}
            index={index}
            sender={message.sender ? message.sender : "Deleted User"}
          />
          // <MessageBoxSkeleton index={index} />
        );
      })}
      <div ref={ref}></div>
    </div>
  );
}
