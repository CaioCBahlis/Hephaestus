import BotReply from "./BotReply"

export type MessageProps = {
    Text: string
    UserMessage: boolean
}

export default function Message(props: {Message: MessageProps}){

    return (
      
     

        <div className={`${props.Message.UserMessage ? "justify-end mr-[30px]" : "justify-start ml-[30px]"} w-[100%] min-h-[50px] h-auto flex`}>
                
                {props.Message.UserMessage ?  (

                    <div className="max-w-[60%] bg-[#6D717F] rounded-xl flex justify-center items-center px-4 py-3"> 

                          <span className="block text-white primary-font whitespace-pre-wrap wrap-anywhere">
                                {props.Message.Text}
                          </span>
                    </div>
                ):
                    <BotReply Text={props.Message.Text}/>
                
                }
                
        </div>
      
    
    )

}