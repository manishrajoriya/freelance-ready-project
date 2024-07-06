import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { Message } from "@/models/user";


export async function POST(request:Request){
    await connectDB()
    const {username, content} = await request.json()
   try {
    const user = await UserModel.findOne({username})
    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
    }

    if (!user.isAcceptingMessage) {
        return new Response(JSON.stringify({ error: "User is not accepting messages" }), { status: 400 })
    } 
    const newMessage = {
        content,
        createdAt:new Date()
    }
    user.messages.push(newMessage as Message)
    await user.save()
    return new Response(JSON.stringify({ message: "Message sent successfully" }), { status: 200 })
   } catch (error) {
    console.log("Error sending message");
    
    return new Response(JSON.stringify({ message : "enternal server error" }), { status: 500 })
   }
}