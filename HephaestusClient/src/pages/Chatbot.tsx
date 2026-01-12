import {Anvil, Menu} from 'lucide-react'
import {useEffect, useState} from "react"
import Chat from '../components/Chat'
import ChatUserInput from '../components/ChatUserInput'
import type { MessageProps } from '../components/Message'
import { ChatbotClient } from '../api/ChatbotClient'



const InitialMessage: MessageProps = {
            Text: "Hello, I'm Hephaestus AI, your personal financial Advisor. How can I help you today?", 
            UserMessage: false,
            MessageType: "Text"
        }

export type ChatHistory = {
    ChatContext: MessageProps[]
}




export default function Chatbot(){
    const [Messages, setMessages] = useState<MessageProps[]>([InitialMessage])
    const [UserQuery, setQuery] = useState<string>("")
    const [File, SetFiles] = useState<File | null>(null)

     async function handleSubmit(NewMessage: MessageProps){
        
        setMessages(x => [...x, NewMessage])
        
        let reply;
        if (NewMessage.MessageType === "File"){
            reply = await ChatbotClient.PostUserFiles({File: File!, UserMessage: true})
        }else{
            reply = await ChatbotClient.PostUserQuery({ChatContext: [...Messages, NewMessage]}) //React Will only update messages next tick, do it manually instead
        }

        let BotResponse: MessageProps = {
            Text: "",
            UserMessage: false,
            MessageType: "Text"
        }


        if (!reply.ok) {
            BotResponse.Text = "An error occurred. Please try again later."
        } else {
            BotResponse.Text = reply.data["reply"]
        }

        setMessages(x => [...Messages, NewMessage, BotResponse])

        setQuery("")
        SetFiles(null)
    }

    useEffect(() => {
        if (UserQuery === "" && File === null){ //Prevents Sending Messages on Mount
            return
        }

        //TODO: Support Message and File
        //Right now, it either sends a File or a Message
        // Because of this if statement, and also because they have different endpoints
        //In the future, merge both endpoints to one to support Files with Messages
        let NewMessage: MessageProps;
        if (File != null){
        
            NewMessage = {Text: "" , UserMessage: true, MessageType: "File", File: File}
        }else{
            NewMessage = {Text: UserQuery , UserMessage: true, MessageType: "Text"}
        }

        handleSubmit(NewMessage)

    }, [UserQuery, File])

    
    
    return (

        <div className="w-screen h-screen bg-[#1B100E] flex flex-col justify-arounditems-center">

            <div className="w-screen h-[10vh] bg-[#201810] flex justify-between items-center">

                    <div className='w-[50%] h-full flex justify-around items-center ml-3'>

                        <div className="relative p-2 border-1 border-[#3E1B12] rounded-[50%]">
                            <Anvil size={25} color='#F47B25'/> 
                            <div className="absolute right-1 w-[8px] h-[8px] bg-[#5EC269] rounded-[100%]"/>
                        </div>

                        <div> 
                            <h1 className="primary-font text-white font-bold text-[13px]"> Hephaestus AI </h1>
                            <div className="flex justify-center items-center gap-[5px]">
                                <div className="w-[8px] h-[8px] bg-[#5EC269] rounded-[100%]"> </div>
                                <div className="primary-font text-white secondary-color text-[11px]"> Online </div>
                            </div>
                        </div>

                    </div>

                    <div className="mr-3 flex justify-center items-center">
                        <Menu color='#F47B25'/>

                    </div>

            </div>

            <Chat Messages={Messages}/> 

            <ChatUserInput SetQuery={setQuery} SetFiles={SetFiles} /> 

        </div>
    )
}