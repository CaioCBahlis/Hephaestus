import {client} from "./client.ts"
import type { MessageProps } from "../components/Message.tsx"


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


export const ChatbotClient =  {

    PostUserQuery: async (Message: UserTextMessage) => {

        const res = await client.post<BotReply>("chatbot/query/", Message)
        return res.data.Reply
    },

    PostUserFiles: async (Message: UserFileMessage ) => {
        
        const Payload = new FormData()
        Payload.append("File", Message.File)

        const res = await client.post<BotReply>("chatbot/file_upload/", Message, { headers: { "Content-Type": "multipart/form-data" }})
        return res.data.Reply

    }

}