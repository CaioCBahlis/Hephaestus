import { ChatbotClient } from "../api/ChatbotClient.ts";
import Message, { type MessageProps } from "../components/Message.tsx"
import {useContext, useEffect, useRef, useState } from "react";
import { UserSessionContext, type ChatHistory } from "../pages/Chatbot.tsx";



export default function Chat(props: { Messages: MessageProps[]}) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const sessionId = useContext(UserSessionContext)
  const [feedbackNonce, setFeedbackNonce] = useState(Date.now())

  const ScrollTreshold = () => {
    const sentinel = scrollRef.current
    if (!sentinel) return true
    const threshold = 120

    return (sentinel.scrollHeight - sentinel.scrollTop - sentinel.clientHeight) < threshold;
  }

  useEffect(() => {

        ChatbotClient.PostSaveConversationState({ChatContext: props.Messages} as ChatHistory, sessionId)

    }, [feedbackNonce])

  useEffect(() => {

    if (!ScrollTreshold()) {
      bottomRef.current?.scrollIntoView({behavior: "smooth"})
    }

  }, [props.Messages.length])

  return (
    <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden my-[15px] px-4">

      <div className="flex flex-col items-center gap-y-[40px]">
        {props.Messages.map((x, idx) => (
          <Message key={idx} Message={x} FeedbackNonce={() => setFeedbackNonce(Date.now())}/>
        ))}
        <div ref={bottomRef}/>
      </div>

    </div>
  );
}