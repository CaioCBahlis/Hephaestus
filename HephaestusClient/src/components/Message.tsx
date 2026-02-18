import BotReply from "./BotReply"
import FileMessage from "./FileMessage"
import TextMessage from "./TextMessage"
import ThinkingMessage from "./ThinkingMessage"
import Hephaestus from '../assets/thetis-and-hephaistos-1200-cropped.webp'

type MessageType = "Text" | "File" | "Thinking"

export type MessageProps = {
    Text: string
    UserMessage: boolean
    MessageType: MessageType
    File?: File | undefined
}

const ParseMessageType = (Message: MessageProps) => {

    if (Message.UserMessage){
        switch (Message.MessageType){
            case "Text":
                return <TextMessage Text={Message.Text} />
            case "File":
                return <FileMessage File={Message.File}/>
        }
    }else{
        switch(Message.MessageType){
            case "Text":
                return <BotReply Text={Message.Text}/>
            case "Thinking":
                return <ThinkingMessage/>
        }
    }

}


export default function Message(props: {Message: MessageProps}){

    
     return (

        <div className={`${props.Message.UserMessage ? "justify-end mr-[30px]" : "justify-start ml-[30px]"} w-[100%] min-h-[50px] h-auto flex`}>
                
                
                {ParseMessageType(props.Message)}
                
        </div>
      
    
    )

}