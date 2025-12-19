import {HardDrive, Plus, SendHorizontal} from "lucide-react"
import { ChatbotClient } from "../api/ChatbotClient"
import type { MessageProps } from "./Message"
import {useState} from "react"

export default function ChatUserInput(props: {UserQuery: string, SetQuery: React.Dispatch<React.SetStateAction<string>>,  SetMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>}){
    const [OpenFileModal, setModalOpen] = useState<Boolean>(false)

    async function handleSubmit(){
        
        if (props.UserQuery === ''){
            return
        }

        const NewMessage: MessageProps =  {Text: props.UserQuery , UserMessage: true}

        props.SetMessages(x => [...x, NewMessage])
        const reply: string = await ChatbotClient.PostUserQuery(props.UserQuery)
        
        props.SetMessages(x => [...x, {Text: reply, UserMessage: false}])
        props.SetQuery("")


    }

    return (
        
        <div className="w-screen h-[10vh] bg-[#201810] flex justify-around items-center">
            
            <button onClick={() => setModalOpen(x => !x)} className={` w-[32px] h-[32px] rounded-[100%] bg-[#6D717F] flex justify-center items-center`}> 
                    <Plus size={25} color={"#211010"} className={` ${OpenFileModal? "rotate-225": "rotate-0"} duration-300`}/> 
            </button>
            
            <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}} className="w-[70%] h-[61%] max-h-[45px] rounded-[35px] bg-[#211010]"> 
                    <input value={props.UserQuery} type="text" onChange={(x) => props.SetQuery(x.target.value)} placeholder="Wonder. Question. Defy." className="primary-font secondary-color w-full h-full pl-4 text-sm"/>
            </form>

             <button onClick={() => handleSubmit()} className="w-[42px] h-[42px] rounded-[100%] bg-[#F47B25] flex justify-center items-center"> 
                    <SendHorizontal color="white"/> 
            </button>

        </div>
    )
}