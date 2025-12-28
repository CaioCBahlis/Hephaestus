import {client} from "./client.ts"


export type LoginPayload = {
    email: string
    password: string
}

export type LoginResponse = {
    ok: Boolean
}

export type Tokens = {
    refresh: string
    access: string
}



export const AccountClient = {

    getCSRF: async () => {
        const token = await client.get<LoginResponse>("/accounts/csrf/")
        return token
    },

    GetToken : async (body: LoginPayload) => {
        
       const res = await client.post<Tokens>("/accounts/token/", body)
       return res

    }


}