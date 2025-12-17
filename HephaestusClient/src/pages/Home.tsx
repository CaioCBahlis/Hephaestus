import {Flame, Menu, Gauge, Landmark, Star, CircleArrowRight} from 'lucide-react'
import Hephaestus from '../assets/thetis-and-hephaistos-1200-cropped.webp'
import LandingBox from '../components/Landing_Box'

export default function Home() {

    return (
        <div className="w-screen h-screen bg-[#201810] flex flex-col justify-start items-center">

            <div className="w-screen flex justify-between items-center mt-5">

                <Flame color='#E3803B' size={35} className="ml-3 rounded-[50%] bg-[#372315] p-1 "/>

                <Menu color='#E3803B' size={25} className="mr-3"/>  
      
            </div>
            
            <div className="w-full h-[20%] flex justify-center items-center mt-[max(20px,6vh)]"> 

                <div className="w-[22vh] h-[22vh] rounded-[50%]">

                    <img src={Hephaestus} alt="Hephaestus" className="rounded-[50%] object-cover"/>

                </div>

            </div>

            <div className="flex flex-col justify-center items-center mt-[max(15px,4vh)]">
                <h1 className="text-center font-light text-white primary-font text-3xl"> Your <span className="primary-color"> AI Accountant </span> </h1>
            
                <p className='w-[70%] mt-[min(10px,3vh)] primary-font font-light text-sm secondary-color text-center'> 
                    <span className="primary-color"> Invest </span> smarter. 
                    <span className="primary-color"> Build </span> Wealth. 
                    <span className="primary-color"> Forge </span> your portfolio. 
                    Everything you need, <span className="primary-color"> one tap </span> away.
                </p>

             </div>

            <div className='w-[90%] h-[35%] mt-[2vh] flex flex-col justify-around gap-[min(10px,5vh)]'>

                <LandingBox Icon={<Gauge size={30} color='#E3803B'/>} title="Blazingly Fast Artificial Intelligence" description="State-of-the-Art Models, for maximum performance in no time"/>
                <LandingBox Icon={<Landmark size={30} color='#E3803B'/>} title="Your All-In-One Website" description="All your finances, just one click away."/>
                <LandingBox Icon={<Star size={30} color='#E3803B'/>} title="Blazingly Fast Artificial Intelligence" description="State-of-the-Art Models, for maximum performance in no time"/>

            </div>

            <button className="w-[90%] h-[min(70px,10vh)] rounded-md bg-[#F47B25] mt-[min(10px,3vh)] flex justify-center items-center gap-[10px]"> 

                <span className="primary-font text-white font-medium font-bold"> Chat with Hephaestus </span>
                <CircleArrowRight color="#FFF"/>

            </button>

            <span className="primary-font mt-1 font-light text-white text-[11px]"> Already have an account? <a href="" className="primary-color"> Log In </a> </span>

             
        </div>
    )

}