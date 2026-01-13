import {client} from "./client.ts"
import type { ChatHistory } from "../pages/Chatbot.tsx"



type BotReply = {
    Reply: string
}

export type UserTextMessage = {
    Text: string
    UserMessage: Boolean
}


export type UserFileMessage = {
    File: File
    UserMessage:Boolean
}

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status?: number; error: unknown };


export const ChatbotClient =  {

    PostUserQuery: async (ChatContext: ChatHistory): Promise<ApiResult<BotReply>> => {

        try {

            const Token = localStorage.getItem("AccessToken")

            const res = await client.post("chatbot/query/",
                ChatContext,
                {
                 withCredentials: true,
                 headers: { Authorization: `Bearer ${Token}` }
                }
            )
            return {ok: true, data: res.data}

        }catch(err: any){

            return {
                ok: false,
                status: err.response?.status,
                error: err.response?.data ?? err.message
            }
        }
        
    },

    PostUserFiles: async (Message: UserFileMessage ) => {
        
        try {

            const Payload = new FormData()
            Payload.append("File", Message.File)
            const Token = localStorage.getItem("AccessToken")

            const res = await client.post("chatbot/file_upload/", 
                Message, 
                {
                    withCredentials: true, 
                    headers: { Authorization: `Bearer ${Token}`, "Content-Type": "multipart/form-data" }
                })
            return {ok: true, data: res.data}

        }catch(err: any){

             return {
                ok: false,
                status: err.response?.status,
                error: err.response?.data ?? err.message
            }
        }

    },

}