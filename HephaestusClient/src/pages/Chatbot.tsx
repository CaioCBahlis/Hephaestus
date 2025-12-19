import {Anvil, Menu} from 'lucide-react'
import {useState} from "react"
import Chat from '../components/Chat'
import ChatUserInput from '../components/ChatUserInput'
import type { MessageProps } from '../components/Message'




export default function Chatbot(){
    const [open, setOpen] = useState<Boolean>(false)
    const [Messages, setMesssages] = useState<MessageProps[]>([])
    const [UserQuery, setQuery] = useState<string>("")
    

    return (

        <div className="w-screen h-screen bg-[#1B100E] flex flex-col justify-arounditems-center">

            <div className="w-screen h-[10vh] bg-[#201810] flex justify-between items-center">

                    <div className='w-[50%] h-full flex justify-around items-center ml-3'>

                        <div className="relative p-2 border-1 border-[#3E1B12] rounded-[50%]">
                            <Anvil size={25} color='#F47B25'/> 
                            <div className="absolute right-1 w-[8px] h-[8px] bg-[#5EC269] rounded-[100%]"/>
                        </div>

                        <div> 
                            <h1 className="primary-font text-white font-bold text-[13px]"> Hephaestus AI </h1>
                            <div className="flex justify-center items-center gap-[5px]">
                                <div className="w-[8px] h-[8px] bg-[#5EC269] rounded-[100%]"> </div>
                                <div className="primary-font text-white secondary-color text-[11px]"> Online </div>
                            </div>
                        </div>

                    </div>

                    <div className="mr-3 flex justify-center items-center">
                        <Menu color='#F47B25'/>

                    </div>

            </div>

            <Chat Messages={Messages}/> 

            <ChatUserInput UserQuery={UserQuery} SetQuery={setQuery} SetMessages={setMesssages}/> 

        </div>
    )
}