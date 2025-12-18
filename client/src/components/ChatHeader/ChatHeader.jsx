import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { ArrowRight, ChevronRight, Circle, Dot } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useChatStore from "../../store/useChatStore";
import GroupInfoModal from "../GroupInfoModal/GroupInfoModal";

export default function ChatHeader() {
  const { user } = useAuthStore();
  const { online, selectedGroup } = useChatStore();
  
  return (
    <>
    <GroupInfoModal/>
    <div className="flex items-center py-5 transition-all hover:bg-base-200 px-5 rounded-xl cursor-pointer sticky top-0 bg-base-100 z-50 shadow-xl" onClick={()=>{
      document.getElementById('my_group_info_modal').showModal()
    }}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-radial from-indigo-500 to-indigo-700 p-3 rounded-full font-bold text-lg">
            <h1>{selectedGroup?.name?.split("to")[0].trim().charAt(0)}{selectedGroup?.name?.split("to")[1].trim().charAt(0)}</h1>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-lg">{selectedGroup?.name}</h1>
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-sm">{selectedGroup?.members?.length} Members</h1>
              <div className="flex items-center">
                {online > 0 && <h1 className="font-semibold text-sm gap-1 text-green-300 flex items-center">
                  <div className="flex items-center bg-green-300 p-1 rounded-full"></div>
                  <p>{online} Online</p>
                </h1>}
              </div>
            </div>
          </div>
        </div>
        <ChevronRight />
      </div>
    </div>
    </>
  );
}
