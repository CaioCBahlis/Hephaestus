import { useEffect, useState } from "react"
import { ChatbotClient } from "../api/ChatbotClient"
import type { MessageProps } from "./Message"
import { CircleFadingPlus, Flame, History } from "lucide-react"
import SessionButton from "./SessionButton"
import { useNavigate } from "react-router"



export type UserSession = {
    id: string
    name: string
    messages: MessageProps[]
}


export default function SessionModal(props: {IsMenuOpen: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [Sessions, setSessions] = useState<UserSession[]>([])
    const navigate = useNavigate()


    useEffect(() => {
        ChatbotClient.GetUserSessions().then(res => {setSessions(res.data.filter((x: UserSession) => x.messages.length > 1));});
}, []);



    return (

        
        <div className={`fixed inset-0 bg-black/30 z-1 transition-opacity duration-300
                ${props.IsMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `} onMouseDown={() => {props.setOpen(false)}}>

               
            <div className={`absolute right-0 top-0 h-full max-w-[500px] w-[75%] bg-[#1B100E]
                transform transition-transform duration-300 ease-in-out
                ${props.IsMenuOpen ? "translate-x-0" : "translate-x-full"}`
                } onMouseDown={(e) => e.stopPropagation()}>
                        
                    <div className="w-[70%] h-[10vh] flex justify-start ml-[30px] items-center gap-[10px] ">

                        <div className="bg-[#1B100E] border-1 border-[#e53a0fff] rounded-full flex justify-center items-center p-[3px]"> 
                            <Flame color={"#e53a0fff"} size={25}/>
                        </div>
                        <span className="text-white text-xl font-bold primary-font"> History </span>
                    </div>

                    <hr className="bg-[#3E1B12] h-[2px] w-full"/> 

                    <div className="w-full h-[90vh] flex flex-col">

                        <span  className="block text-[#e53a0fff] text-sm font-bold ml-[20px] mt-[20px] primary-font"> RECENT CHATS </span>


                        <div className="flex overflow-y-auto flex-col justify-start items-center gap-[10px] mt-[20px] mb-[20px]">

                            <button className="w-[90%] min-h-[75px] hover:border-2 hover:border-[#e53a0fff] bg-white flex justify-center items-center rounded-md text-center gap-[10px]" 
                            onClick={() => {
                                navigate("/chatbot")
                                props.setOpen(false)
                            }}>

                                <CircleFadingPlus/>
                                <span className="primary-font text-lg"> Start New Chat  </span>

                            </button>
                            
                            {Sessions.map((Sess, idx) => (
                                
                                <SessionButton Session={Sess} idx={idx} key={idx} setOpen={props.setOpen} /> 
                                
                            ))}

                        </div>

                    </div>
            </div>

        </div>  
    )
}