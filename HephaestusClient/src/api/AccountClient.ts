import { toast } from "react-toastify"
import {client} from "./client.ts"



export type LoginPayload = {
    email: string
    password: string
}

export type RegisterPayload = {
    Name: string
    LastName: string
    Email: string
    Password: string
}

export type Response = {
    ok: Boolean
}

export type Tokens = {
    refresh: string
    access: string
}

export const AccountClient = {

    getCSRF: async () => {
        const token = await client.get<Response>("/accounts/csrf/")
        return token
    },

    GetToken : async (body: LoginPayload) => {
        
        try{
            const res = await client.post<Tokens>("/accounts/token/", body)
            return res
        } catch (e){
            return undefined
        }

    },

    register: async (body: RegisterPayload) => {

            try {
          
                const res = await client.post<Response>("/accounts/create_account/", body)
                return res.data

            } catch (e: any){
                
                console.log(e)
                toast.error(`Fail to Create an Account, got ${e}`)
                return undefined
            }

    
    },

    AuthMe: async () => {
        
        const Token = localStorage.getItem("AccessToken")
        const res = await client.get("/accounts/auth/me", 
            {
                 withCredentials: true,
                 headers: { Authorization: `Bearer ${Token}` }
            })
        return res.data
    }


}