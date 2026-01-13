import {LockKeyhole, Eye, EyeClosed, Mail, CircleArrowRight} from 'lucide-react'
import {useState, useEffect} from "react"
import { useNavigate } from "react-router";
import {AccountClient, type LoginPayload} from '../api/AccountClient'
import { useUser } from './UserContextProvider';




export default function LoginBox(){
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [show, setShow] = useState<Boolean>(false)
    let navigate = useNavigate();
    const {setUser} = useUser()

    useEffect(() => {
        AccountClient.getCSRF()
    }, [])

    async function handleLogin(Login: LoginPayload) {
        //TODO: Add Validation On Login
        
        const res = await AccountClient.GetToken(Login)
 
       
        if (res.status){

            localStorage.setItem("AccessToken", res.data.access)
            localStorage.setItem("RefreshToken", res.data.refresh)
            
            setUser({email: email})
          
            navigate("/chatbot")
        }

        


        return false
    }

    return (

        <div className="w-[80%] h-[55%] flex flex-col justify-center items-center gap-[10px]">
            
            <div className="w-full h-[min(100%,40vh)] flex flex-col justify-center items-start"> 

               <span className="primary-font text-white font-bold"> Email Address </span>
                <div className="w-full h-[85%] rounded-sm bg-[#372F28] flex items-center pl-3"> 

                    <Mail size={20} color="#6D717F"/>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="text" required placeholder='Enter your Email Address' className="w-full h-full pl-3 primary-font text-sm secondary-color"/>
    
                </div>
            </div>

            <div className="w-full h-[min(100%,40vh)] flex flex-col justify-center items-start"> 
                <span className="primary-font text-white font-bold"> Password </span>

                <div className="w-full h-[min(100%,40vh)] rounded-sm bg-[#372F28] flex items-center pl-3"> 

                    <LockKeyhole size={20} color="#6D717F"/>
                    <input value={password} onChange={(p) => setPassword(p.target.value)}  type={show? "text": "password"} required placeholder='Enter your password' className="w-full h-full pl-3 primary-font text-sm secondary-color"/>
                    
                    <button className="pr-2" onClick={() => setShow(x => !x)}>
                        {show? <EyeClosed size={20} color="#6D717F"/> : <Eye size={20} color="#6D717F"/>}
                    </button>

                </div>
            </div>

            <button onClick={() => {handleLogin({email:email, password:password})}} className="w-full h-[min(100%,40vh)] bg-[#E4813D] mt-[20px] flex justify-center items-center gap-[5px] rounded-sm">
                <span className="text-white font-primary text-lg font-bold"> Log In </span>
                <CircleArrowRight color="#FFF"/>
            </button>

            <div className="w-full h-[5px] flex justify-between items-center mt-[20px]">
                    <hr className="w-[40%] h-[2px] bg-white"/>
                    <span className="text-white primary-font"> OR </span>
                    <hr className="w-[40%] h-[2px] bg-white"/>
            </div>

             <button className="w-full h-[min(100%,40vh)] bg-[#FFF] mt-[20px] flex justify-center items-center gap-[5px] rounded-sm">
                <span className="text-black font-primary text-sm"> Continue With Google </span>
                <CircleArrowRight color="#FFF"/>
            </button>

            <a href='/register' className="text-white primary-font text-[13px]"> New Here? <span className="primary-color"> Create an Account</span>  </a>

        </div>

    )

}