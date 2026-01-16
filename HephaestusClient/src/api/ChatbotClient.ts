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

    PostUserQuery: async (ChatContext: ChatHistory, SessionId: string): Promise<ApiResult<BotReply>> => {

        try {

            const Token = localStorage.getItem("AccessToken")

            const res = await client.post(`chatbot/query/${SessionId}`,
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

    PostUserFiles: async (Message: UserFileMessage, SessionId: string ) => {
        
        try {

            const Payload = new FormData()
            Payload.append("File", Message.File)
            const Token = localStorage.getItem("AccessToken")

            const res = await client.post(`chatbot/file_upload/${SessionId}`, 
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

    GetSessionId: async () => {

        try{

            const Token = localStorage.getItem("AccessToken")
            const res = await client.get(`chatbot/get_session_id/`, {
                    withCredentials: true, 
                    headers: { Authorization: `Bearer ${Token}`, "Content-Type": "multipart/form-data" }
            })
            return {ok: true, status: res.status, data: res.data["SessionId"]}

        }catch (err: any){

            console.log("Failed to Fetch Session Id")
            return {ok:false, status: err.response?.status, data: err}
        }
    },

    GetSessionContext: async (SessionId: string) => {
        try{

            const Token = localStorage.getItem("AccessToken")

            const res = await client.get(`chatbot/get_session_context/${SessionId}`, {
                    withCredentials: true, 
                    headers: { Authorization: `Bearer ${Token}`, "Content-Type": "multipart/form-data" }
            })
            return {ok: true, status: res.status, data: res.data["messages"]}

        }catch (err: any){

            console.log("Failed to Fetch Session Context")
            return {ok:false, status: err.response?.status, data: err}
        }
    },

    GetUserSessions: async () => {

        try{

            const Token = localStorage.getItem("AccessToken")

            const res = await client.get(`chatbot/get_user_sessions`, {
                    withCredentials: true, 
                    headers: { Authorization: `Bearer ${Token}`, "Content-Type": "multipart/form-data" }
            })
            return {ok: true, status: res.status, data: res.data["Sessions"]}

        }catch (err: any){

            console.log("Failed to Fetch Session Data from User")
            return {ok:false, status: err.response?.status, data: err}
        }

    }

}