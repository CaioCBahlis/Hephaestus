


export default function ThinkingMessage(){


    return (
        <div className="bg-[#211010] border border-[#3E1B12] max-w-[60%] rounded-xl flex justify-center items-center px-4 py-3">
            <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-white/90 animate-bounce [animation-delay:0ms]" />
                <span className="inline-block w-2 h-2 rounded-full bg-white/90 animate-bounce [animation-delay:200ms]" />
                <span className="inline-block w-2 h-2 rounded-full bg-white/90 animate-bounce [animation-delay:400ms]" />
            </div>
        </div>
    )
}