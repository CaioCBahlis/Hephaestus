
export type MessageProps = {
    Text: string
    UserMessage: boolean
}

export default function Message(props: {Message: MessageProps}){

    return (

        <div className={`${props.Message.UserMessage ? "justify-end mr-[30px]" : "justify-start ml-[30px]"} w-[100%] min-h-[50px] h-auto flex`}>
            
            <div className="w-[40%] bg-[#6D717F] rounded-xl flex justify-center items-center"> 
                <span className="flex items-center justify-start w-[80%] h-[80%] text-white primary-font"> {props.Message.Text} </span>
            </div>
        </div>
    )

}