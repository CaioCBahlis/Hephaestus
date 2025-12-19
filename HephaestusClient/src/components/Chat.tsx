import Message, { type MessageProps } from "../components/Message.tsx"



export default function Chat(props: {Messages: MessageProps[]}){
    return (
        <div className="w-screen min-h-[80vh] h-auto flex flex-col justify-items items-center overflow-scroll gap-y-[10px] mt-[30px]">

            {props.Messages.map((x) => {
              return <Message Message={x}/> 
            })}

        </div>
    )
}