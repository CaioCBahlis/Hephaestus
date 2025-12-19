

export default function BotReply(props: {Text: string}){

    return (
         <div className="bg-[#211010] border-1 border-[#3E1B12] max-w-[60%] rounded-xl flex justify-center items-center px-4 py-3"> 
            <span className="text-white primary-font block text-white primary-font whitespace-pre-wrap wrap-anywhere"> {props.Text} </span>
        </div>

        
    )
}