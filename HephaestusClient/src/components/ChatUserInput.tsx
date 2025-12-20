import {Plus, SendHorizontal} from "lucide-react"
import { ChatbotClient } from "../api/ChatbotClient"
import type { MessageProps } from "./Message"
import {useState} from "react"
import FileModal from "../components/FileModal.tsx"

export default function ChatUserInput(props: {UserQuery: string, SetQuery: React.Dispatch<React.SetStateAction<string>>,  SetMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>}){
    const [OpenFileModal, setModalOpen] = useState<Boolean>(false)
     const [File, SetFiles] = useState<File | null>(null)

    async function handleSubmit(){
        
        if (props.UserQuery === '' && File === null){
            return
        }

        let NewMessage: MessageProps;
        if (File != null){
            console.log(File.name)
            NewMessage = {Text: "" , UserMessage: true, MessageType: "File", File: File}
        }else{
            NewMessage = {Text: props.UserQuery , UserMessage: true, MessageType: "Text"}
        }

        props.SetMessages(x => [...x, NewMessage])
        
        let reply;
        if (NewMessage.MessageType === "File"){
            reply = await ChatbotClient.PostUserFiles({File: File!, UserMessage: true})
        }else{
            reply = await ChatbotClient.PostUserQuery({Text: props.UserQuery, UserMessage: true})
        }

        props.SetMessages(x => [...x, {Text: reply, UserMessage: false,  MessageType: "Text"}])
        
        props.SetQuery("")
        SetFiles(null)
    }

    return (
        
        <div className="w-screen h-[10vh] bg-[#201810] flex justify-around items-center">
            
            
            <button onClick={() => setModalOpen(x => !x)} className={`relative w-[32px] h-[32px] rounded-[100%] bg-[#6D717F] flex justify-center items-center`}> 
                    <FileModal SetFile={SetFiles} IsOpen={OpenFileModal}/>
                    <Plus size={25} color={"#211010"} className={`absolute ${OpenFileModal? "rotate-225": "rotate-0"} duration-300`}/> 
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