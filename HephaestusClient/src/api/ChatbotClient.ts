import {client} from "./client.ts"


type ChatbotResponse = {
    "ok": Boolean
}

type BotReply = {
    Reply: string
}
export const ChatbotClient =  {

    PostUserQuery: async (Query: string) => {

        const res = await client.post<BotReply>("chatbot/query/", {message: Query})
        return res.data.Reply

    }

}