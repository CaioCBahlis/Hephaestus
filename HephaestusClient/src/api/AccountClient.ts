import {client} from "./client.ts"


export type LoginPayload = {
    email_address: string
    password: string
}

export type LoginResponse = {
    ok: Boolean
}

export const AccountClient = {

    getCSRF: async () => {
        const token = await client.get<LoginResponse>("/accounts/csrf/")
        return token
    },

    login : async (body: LoginPayload) => {
        
        

       const res = await client.post<LoginResponse>("/accounts/login/", body)
       return res.data

    }
}