import BotReply from "./BotReply"
import FileMessage from "./FileMessage"
import TextMessage from "./TextMessage"
import ThinkingMessage from "./ThinkingMessage"
import Graph from "./Graph"

type MessageType = "Text" | "File" | "Thinking" | "Graph"

export enum UserEval {
    Liked = 1,
    Neutral = 0,
    Disliked = -1,
}

export type MessageProps = {
    Text: string
    UserMessage: boolean
    MessageType: MessageType
    File?: File | undefined
    Liked?: UserEval
}

const ParseMessageType = (Message: MessageProps, FeedbackNonce: () => void) => {

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
                return <BotReply Message={Message} Feedback={FeedbackNonce}/>
            case "Thinking":
                return <ThinkingMessage/>
            case "Graph":
                return <Graph GraphData={Message.Text}/>
        }
    }

}

export default function Message(props: {Message: MessageProps, FeedbackNonce: () => void}){


     return (

        <div className={`${props.Message.UserMessage ? "justify-end mr-[30px]" : "justify-start ml-[30px]"} w-[100%] min-h-[50px] h-auto flex`}>
                
                {ParseMessageType(props.Message, props.FeedbackNonce)}
                
        </div>
      
    
    )

}