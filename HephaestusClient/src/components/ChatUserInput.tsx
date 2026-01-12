import {Plus, SendHorizontal} from "lucide-react"
import { ChatbotClient } from "../api/ChatbotClient"
import type { MessageProps } from "./Message"
import {useState} from "react"
import FileModal from "../components/FileModal.tsx"

export default function ChatUserInput(props: {SetQuery: React.Dispatch<React.SetStateAction<string>>,  SetFiles: React.Dispatch<React.SetStateAction<File | null>> }){
    const [OpenFileModal, setModalOpen] = useState<Boolean>(false)
    const [UserInput, setUserInput] = useState<string>("")
    const [FileInput, setFileInput] = useState<File | null>(null)

    function handleSubmit(){

        if (FileInput){
            props.SetFiles(FileInput)
            setFileInput(null)
        }
        
        if (UserInput){
            props.SetQuery(UserInput)
            setUserInput("")
        }

    }
    
    return (
        
        <div className="w-screen h-[10vh] bg-[#201810] flex justify-around items-center">
            
            
            <button onClick={() => setModalOpen(x => !x)} className={`relative w-[32px] h-[32px] rounded-[100%] bg-[#6D717F] flex justify-center items-center`}> 
                    <FileModal SetFile={setFileInput} IsOpen={OpenFileModal}/>
                    <Plus size={25} color={"#211010"} className={`absolute ${OpenFileModal? "rotate-225": "rotate-0"} duration-300`}/> 
            </button>
            
            <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}} className="w-[70%] h-[61%] max-h-[45px] rounded-[35px] bg-[#211010]"> 
                    <input value={UserInput} type="text" onChange={(x) => setUserInput(x.currentTarget.value)} placeholder="Wonder. Question. Defy." className="primary-font secondary-color w-full h-full pl-4 text-sm"/>
            </form>

             <button onClick={(e) => handleSubmit()} className="w-[42px] h-[42px] rounded-[100%] bg-[#F47B25] flex justify-center items-center"> 
                    <SendHorizontal color="white"/> 
            </button>

        </div>
    )
}