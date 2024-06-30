import { Message } from "@/models/user"


export interface ApiResponce{
    success: boolean,
    message: string,
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
}