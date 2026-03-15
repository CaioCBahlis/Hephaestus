import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import type { MessageProps, UserEval } from "./Message";
import { UserSessionContext } from "../pages/Chatbot";
import { ChatbotClient } from "../api/ChatbotClient";



function parse_message_like(Feedback?: UserEval){

    if (!Feedback){
        return [false, false]
    }

    if (Feedback === 1){
        return [true, false]
    }else if (Feedback === -1){
        return [false, true]
    }else{
        return [false, false]
    }
}    

export default function BotReply(props: {Message: MessageProps, Feedback: () => void}){
    const [IsLiked, setIsLiked] = useState(parse_message_like(props.Message.Liked)[0])
    const [IsDisliked, setIsDisLiked] = useState(parse_message_like(props.Message.Liked)[1])
    const [copied, setCopied] = useState(false);

    
    async function handleCopy() {
        try {
        await navigator.clipboard.writeText(props.Message.Text);
        setCopied(true);
        toast.info("Text copied to clipboard");

        setTimeout(() => {
            setCopied(false);
        }, 1800);
        } catch {
        toast.error("Failed to copy text");
        }
  }
    
    return (
         <div className="bg-[#211010] border-1 border-[#3E1B12] max-w-[60%] rounded-xl flex flex-col px-4 py-3 gap-x-4"> 

            <div className="text-white primary-font block text-white primary-font whitespace-pre-wrap wrap-anywhere"> 
                <ReactMarkdown>{props.Message.Text}</ReactMarkdown> 
            </div>

            <div className="w-full flex flex-row justify-left items-left pt-4">

                <button
                    onClick={handleCopy}
                    className={`rounded-md p-2 transition-all duration-200 active:scale-95 ${
                        copied ? "bg-green-600/80" : "hover:bg-white/10"
                    }`}
                    aria-label={copied ? "Copied" : "Copy text"}
                    title={copied ? "Copied" : "Copy text"}
                    >
                    <span className="flex items-center justify-center transition-all duration-200">
                        {copied ? (
                        <Check size={18} color="white" />
                        ) : (
                        <Copy size={18} color="white" />
                        )}
                    </span>
                </button>

                <button className="p-2 hover:bg-white/10 rounded-xl" onClick={() => {
                    setIsDisLiked(false)
                    if (IsLiked){
                        props.Message.Liked = 0
                        setIsLiked(false)
                    }else{
                        props.Message.Liked = 1
                        setIsLiked(true)
                    }
                    
                    props.Feedback()
                }}> 
                    <ThumbsUp size={18} color={IsLiked? "#008000": "white"}/>
                </button>

                <button className="p-2 hover:bg-white/10 rounded-xl"  onClick={() => {
                    setIsLiked(false)
                    if (IsDisliked){
                        props.Message.Liked = 0
                        setIsDisLiked(false)
                    }else{
                        props.Message.Liked = -1
                        setIsDisLiked(true)
                    }

                    props.Feedback()
                }}> 
                    <ThumbsDown size={18} color={IsDisliked? "#c81111ff": "white"}/>
                </button>

            </div>

        </div>
    )
}