import {client} from "./client.ts"
import type { MessageProps } from "../components/Message.tsx"
import { data } from "react-router"
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

            const res = await client.post("chatbot/query/",
                ChatContext,
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

            const res = await client.post("chatbot/file_upload/", Message, { headers: { "Content-Type": "multipart/form-data" }})
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