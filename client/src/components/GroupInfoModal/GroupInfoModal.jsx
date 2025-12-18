import React from "react";
import useChatStore from "../../store/useChatStore";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GroupInfoModal() {
  const { selectedGroup } = useChatStore();
  const navigate = useNavigate();
  return (
    <dialog id="my_group_info_modal" className="modal">
      <div className="modal-box flex flex-col gap-8">
        <h3 className="font-bold text-lg">{selectedGroup?.name}</h3>
        <div className="flex flex-col justify-center gap-3">
          <div className="flex flex-col justify-center gap-2">
            <h1 className="font-bold">Driver</h1>
            <div className="flex items-center">
              <div className="flex justify-between items-center w-full px-4 transition-all hover:bg-base-200 py-4 rounded-xl cursor-pointer" onClick={()=>{
                navigate(`/account/${selectedGroup?.members[0]._id}`)
              }}>
                <div className="flex items-center gap-3">
                  {selectedGroup?.members?.length > 0 && (
                    <img
                      src={selectedGroup?.members[0]?.profilePic}
                      alt=""
                      className="size-10 rounded-full"
                    />
                  )}
                  <div className="flex flex-col justify-center">
                    <p className="font-bold">
                      {selectedGroup?.members?.length > 0
                        ? selectedGroup?.members[0]?.firstName
                        : ""} {selectedGroup?.members?.length > 0
                        ? selectedGroup?.members[0]?.lastName
                        : ""}
                    </p>
                    <p className="text-sm font-semibold text-white/60">
                      {selectedGroup?.members?.length > 0
                        ? selectedGroup?.members[0]?.email
                        : ""}
                    </p>
                  </div>
                </div>
                <ChevronRight />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <h1 className="font-bold">Passengers ({selectedGroup?.members?.length-1})</h1>
            <div className="flex flex-col items-center gap-1">
              {selectedGroup?.members?.map((member, index) => {
                if(index <= 0) return;
                return (
                  <div key={index} className="flex justify-between items-center w-full px-4 transition-all hover:bg-base-200 py-4 rounded-xl cursor-pointer" onClick={()=>{
                    navigate(`/account/${member._id}`)
                  }}>
                    <div className="flex items-center gap-3">
                        <img
                          src={member.profilePic}
                          alt=""
                          className="size-10 rounded-full"
                        />
                      <div className="flex flex-col justify-center">
                        <p className="font-bold">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm font-semibold text-white/60">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <ChevronRight />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default GroupInfoModal;
