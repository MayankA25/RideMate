import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSuggestionStore } from "../../store/useSuggestionStore";

export default function Header({ headerTitle }) {
    const navigate = useNavigate();
    const { setInfoFilled } = useSuggestionStore();
    const params = useParams();
    console.log("Params Header: ", params);
  return (
    <div className="flex items-center px-3 gap-5">
      <span
        className="flex items-center transition-all cursor-pointer hover:bg-base-300 p-2 rounded-full"
        onClick={() => {
          if(params['*'].split("/")[0] == 'rides') setInfoFilled(false);
          navigate(-1);
        }}
      >
        <ArrowLeft className="size-5" />
      </span>
      <h1 className="font-bold text-xl">{ headerTitle }</h1>
    </div>
  );
}
