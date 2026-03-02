import { CircleArrowRight, Eye, EyeClosed, LockKeyhole, Mail, FileUser, User } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"
import {AccountClient, type LoginPayload, type RegisterPayload} from '../api/AccountClient'
import { useNavigate } from "react-router"
import { useUser } from "./UserContextProvider"



export default function RegisterBox(){ 
    const [Name, setName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")
    const [PasswordShow, setPasswordShow] = useState(false)
    const [ConfirmShow, setConfirmShow] = useState(false)
    let navigate = useNavigate();

    const {setUser} = useUser()


    async function handleSubmit(e: React.FormEvent<HTMLButtonElement>){
        e.preventDefault()

        if (!VerifyEmail(Email)){
            setEmail("")
            return
        }

        if (!VerifyPassword(Password, ConfirmPassword)){
            return
        }

        const payload: RegisterPayload = {
            Name: Name,
            LastName: LastName,
            Email: Email,
            Password: Password
        }

        const TokenPayload: LoginPayload = {
            email: Email,
            password: Password,
        }

        const res = await AccountClient.register(payload)

        if (res?.ok){
            const res = await AccountClient.GetToken(TokenPayload)

            localStorage.setItem("AccessToken", res!.data.access)
            localStorage.setItem("RefreshToken", res!.data.refresh)
            
            setUser({email: Email})
            navigate("/chatbot")
        }
        
        
    }

    function VerifyEmail(Email: string): Boolean{

        const EmailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const IsValid: boolean = EmailRegex.test(Email)
        if (!IsValid){
            toast.error("Email Format is Invalid")
            return false
        }
        return true
    }

    function VerifyPassword(Password: string, ConfirmPassword: string){

        if (Password !== ConfirmPassword){
            toast.error("Both Passwords must match")
            return false
        }

        if (Password.length <= 7){
            toast.error("Both Passwords must be at least 8 characters in length")
            return false
        }    

        return true
    }
    


    return (
       
        <div className="w-[92%] h-[65%] flex flex-col justify-start items-center gap-4 mt-[5px]">
            
            <div className="w-full h-[min(80px,20vh)] min-h-[40px] flex flex-row justify-between items-center gap-4"> 

                <div className="w-[47%] h-full flex flex-col"> 
                    <span className="primary-font text-white font-bold"> First Name </span>
                    <div className="w-full h-full min-h-[40px] rounded-sm bg-[#372F28] flex items-center pl-3"> 

                        <User size={20} color="#6D717F"/>
                        <input value={Name} onChange={e => setName(e.currentTarget.value)} type="text" required placeholder='John' className="w-full h-full pl-3 primary-font text-sm secondary-color"/>
        
                    </div>

                </div>

                <div className="w-[47%] h-full flex flex-col"> 

                    <span className="primary-font text-white font-bold"> Last Name </span>
                    <div className="w-full min-h-[40px] h-full rounded-sm bg-[#372F28] flex items-center pl-3"> 

                        <FileUser size={20} color="#6D717F"/>
                        <input value={LastName} onChange={e => setLastName(e.currentTarget.value)} type="text" required placeholder='Doe' className="w-full h-full pl-3 primary-font text-sm secondary-color"/>
        
                    </div>
                </div>

            </div>

            <div className="w-full h-[min(80px,20vh)] flex flex-col justify-center items-start"> 

                <span className="primary-font text-white font-bold"> Email Address </span>
                <div className="w-full h-full min-h-[40px] rounded-sm bg-[#372F28] flex items-center pl-3"> 

                    <Mail size={20} color="#6D717F"/>
                    <input value={Email} onChange={e => setEmail(e.currentTarget.value)} type="text" required placeholder='youremail@example.com' className="w-full h-full pl-3 primary-font text-sm secondary-color"/>

                </div>

            </div>

            <div className="w-full h-[min(160px,40vh)] flex flex-col justify-around items-center gap-[7px]"> 

                <div className="w-full h-full flex flex-col"> 

                    <span className="primary-font text-white font-bold"> Password </span>
                    <div className="w-full h-full min-h-[40px] rounded-sm bg-[#372F28] flex items-center pl-3"> 

                        <LockKeyhole size={20} color="#6D717F"/>
                        <input value={Password} onChange={e => setPassword(e.currentTarget.value)} type={PasswordShow? "text" : "password"} required placeholder='Enter your password' className="w-full h-full pl-3 primary-font text-sm secondary-color"/>
                        <button className="pr-2" onClick={() => setPasswordShow(x => !x)}>
                            {PasswordShow? <EyeClosed size={20} color="#6D717F"/> : <Eye size={20} color="#6D717F"/>}
                        </button>
        
                    </div>

                </div>

                <div className="w-full h-full flex flex-col"> 

                    <span className="primary-font text-white font-bold"> Confirm your password </span>
                    <div className="w-full h-full min-h-[40px] rounded-sm bg-[#372F28] flex items-center pl-3"> 

                        <LockKeyhole size={20} color="#6D717F"/>
                        <input value={ConfirmPassword} onChange={e => setConfirmPassword(e.currentTarget.value)}  type={ConfirmShow? "text": "password"} required placeholder='Confirm your password' className="w-full h-full pl-3 primary-font text-sm secondary-color"/>
                        <button className="pr-2" onClick={() => setConfirmShow(x => !x)}>
                            {ConfirmShow? <EyeClosed size={20} color="#6D717F"/> : <Eye size={20} color="#6D717F"/>}
                        </button>
        
                    </div>
                </div>

            </div>

            <button onClick={e => handleSubmit(e)} className="w-full min-h-[60px] bg-[#E4813D] flex justify-center items-center gap-[5px] mt-[10px] rounded-sm">
                    <span className="text-white font-primary text-lg font-bold"> Register </span>
                    <CircleArrowRight color="#FFF"/>
            </button>


             <div className="w-full h-[5px] flex justify-between items-center mt-[20px]">
                    <hr className="w-[27%] h-[2px] bg-white"/>
                    <span className="text-white primary-font"> Or Continue With </span>
                    <hr className="w-[27%] h-[2px] bg-white"/>
            </div>

            <div className="w-[40px] min-h-[40px] bg-white rounded-[100%] primary-font flex justify-center items-center mt-[10px] mb-[10px]">  

                 <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block w-[60%] h-[60%]">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
            </div>
           
            <a href='/login' className="text-white primary-font text-[13px] mb-[5px]"> Already have an Account? <span className="primary-color"> Login </span>  </a>

        </div>
    )

}