import {Anvil} from 'lucide-react'

import LoginBox from '../components/LoginBox'


export default function Login(){


    return (
        <div className="w-screen h-screen bg-[#1B100E] flex flex-col justify-start items-center">

            <div className='w-[min(100%,600px)] h-screen flex flex-col justify-start items-center'> 

                <div className="w-screen h-[15%] flex justify-center items-center mb-[20px]">

                    
                    <a href="/" className="w-[min(30%,200px)] h-[90%] rounded-xl bg-[#F47B25] mt-[max(60px,9vh)] flex justify-center items-center">
                       <Anvil color='white' size={65} strokeWidth={1}> </Anvil>
                    </a>
                
                </div>

                <div className="w-screen h-[20%] flex flex-col items-center justify-center gap-[20px] mt-[5px]"> 

                    <h1 className="primary-font text-white text-3xl"> Forge your <span className="primary-color"> future </span>   </h1>

                    <p className="w-[65%] text-center primary-font text-sm secondary-color"> Chat with Hephaestus AI and redefine what's possible </p>

                </div>

                <LoginBox/> 
            </div>
        </div>
    )
}