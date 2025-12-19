import Message, { type MessageProps } from "../components/Message.tsx"



export default function Chat(props: { Messages: MessageProps[] }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden my-[15px] px-4">

      <div className="flex flex-col items-center gap-y-[40px]">
        {props.Messages.map((x, idx) => (
          <Message key={idx} Message={x} />
        ))}

      </div>
    </div>
  );
}