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
        
       const res = await client.post<Tokens>("/accounts/token/", body)
       return res

    },

    register: async (body: RegisterPayload) => {
        const res = await client.post<Response>("/accounts/create_account/", body)
        return res.data
    }


}