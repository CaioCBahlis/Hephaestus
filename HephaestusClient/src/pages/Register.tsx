

import {Anvil} from 'lucide-react'
import { useState } from 'react'
import RegisterBox from '../components/RegisterBox'


export default function Register(){
    const [name, setName] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    return (
        <div className="w-screen h-screen bg-[#1B100E] flex flex-col justify-start items-center">

            <div className='w-[min(100%,600px)] h-screen flex flex-col justify-start items-center'> 

                <div className="w-screen h-[13%] flex justify-center items-center mb-[10px]">

                    
                    <a href="/" className="w-[min(30%,200px)] h-[90%] rounded-xl bg-[#F47B25] mt-[max(40px,6vh)] flex justify-center items-center">
                       <Anvil color='white' size={65} strokeWidth={1}> </Anvil>
                    </a>
                
                </div>

                <div className="w-screen h-[20%] flex flex-col items-center justify-center gap-[15px]"> 

                    <h1 className="primary-font text-white text-3xl"> Start your <span className="primary-color"> Journey </span>   </h1>

                    <p className="w-[65%] text-center primary-font text-sm secondary-color"> Create an account and start chatting with Hephaestus right away! </p>

                </div>

                <RegisterBox/>

            </div>
        </div>
    )
}