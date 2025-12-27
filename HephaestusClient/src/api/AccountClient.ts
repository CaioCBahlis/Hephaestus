import {client} from "./client.ts"


export type LoginPayload = {
    email_address: string
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



export const AccountClient = {

    getCSRF: async () => {
        const token = await client.get<Response>("/accounts/csrf/")
        return token
    },

    login : async (body: LoginPayload) => {
        
       const res = await client.post<Response>("/accounts/login/", body)
       return res.data

    },

    register: async (body: RegisterPayload) => {
        const res = await client.post<Response>("/accounts/create_account/", body)
        return res.data
    }
}