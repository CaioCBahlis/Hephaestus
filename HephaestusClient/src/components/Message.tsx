import BotReply from "./BotReply"
import {File} from "lucide-react"

type MessageType = "Text" | "File"

export type MessageProps = {
    Text: string
    UserMessage: boolean
    MessageType: MessageType
    File?: File | undefined
}

export default function Message(props: {Message: MessageProps}){

    return (
      
     

        <div className={`${props.Message.UserMessage ? "justify-end mr-[30px]" : "justify-start ml-[30px]"} w-[100%] min-h-[50px] h-auto flex`}>
                
                

                {props.Message.UserMessage ?  (
                    <>
                    {props.Message.MessageType === "Text" ? (

                        <div className="max-w-[60%] bg-[#6D717F] rounded-xl flex justify-center items-center px-4 py-3"> 

                            <span className="block text-white primary-font whitespace-pre-wrap wrap-anywhere">
                                    {props.Message.Text}
                            </span>
                        </div>
                    ):(
                        <div className="max-w-[60%] bg-[#6D717F] rounded-xl flex justify-center items-center px-4 py-3 gap-[5px]"> 
                            <File color="#E3803B"/>
                            <span className="block text-white primary-font whitespace-pre-wrap wrap-anywhere">
                                    {props.Message.File?.name}
                            </span>
                        </div>
                    )}
                    </>

                ):
                    <BotReply Text={props.Message.Text}/>
                
                }
                
        </div>
      
    
    )

}