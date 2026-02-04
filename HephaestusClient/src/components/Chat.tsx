import Message, { type MessageProps } from "../components/Message.tsx"
import { useEffect, useRef } from "react";



export default function CChat(props: { Messages: MessageProps[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const ScrollTreshold = () => {
    const sentinel = scrollRef.current
    if (!sentinel) return true
    const threshold = 120

    return (sentinel.scrollHeight - sentinel.scrollTop - sentinel.clientHeight) < threshold;
  }

  useEffect(() => {

    if (!ScrollTreshold()) {
      bottomRef.current?.scrollIntoView({behavior: "smooth"})
    }

  }, [props.Messages.length])

  return (
    <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden my-[15px] px-4">

      <div className="flex flex-col items-center gap-y-[40px]">
        {props.Messages.map((x, idx) => (
          <Message key={idx} Message={x} />
        ))}
        <div ref={bottomRef}/>
      </div>

    </div>
  );
}