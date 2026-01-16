import { useEffect } from "react";
import type { UserSession } from "./SessionModal";
import { Navigate, useNavigate } from "react-router";



export default function SessionButton(props: {idx: number, Session: UserSession, setOpen: React.Dispatch<React.SetStateAction<boolean>>}){
    const navigate = useNavigate()

    function handleKeydown(e: React.KeyboardEvent){



    }

    useEffect(() => {

        document.addEventListener("keydown", () => handleKeydown)
        
        return () => document.removeEventListener("keydown", () => handleKeydown)

    }, [])

    return (
        <button className="w-[90%] min-h-[75px] hover:bg-[#e53a0fff] focus:bg-[#e53a0fff] hover:border-transparent border-1 border-[#e53a0fff] flex justify-start items-center rounded-md"
            onClick={() => {
                navigate(`/chatbot/` + props.Session.id)
                props.setOpen(false)
            }}
        >

            <div className="w-[9px] h-full bg-[#e53a0fff]"/> 

   
            <div className="w-[95%] ml-[13px]">
            <span className="h-[10px] text-center text-clip text-sm min-h-[10px] text-center text-white"> {props.Session.messages[1] ? props.Session.messages[1].Text : "New Chat" } </span>
            <span> </span>
             </div>

        </button>
    )
}