import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth].js/options"; 
import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { User } from "next-auth";



export async function DELETE(request: Request, {params}:{params: {messageid: string}}){
   const messageId =  params.messageid 
   await connectDB()
   const session = await getServerSession(authOptions)
    const user:User = session?.user as User

   if (!session || !session.user) {
    return new Response(
        JSON.stringify({
            success: false,
            message: "Not Authentication"
        }), { status: 401 }
    )
}

    try {
       const updateResult =  await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )

        if (updateResult.modifiedCount == 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Failed to delete message"
                }), { status: 404 }
            )
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Message deleted successfully"
            }), { status: 200 }
        )
    } catch (error) {
        console.log("error in delete route", error);
        
        return new Response(
            JSON.stringify({
                success: false,
                message: "error to delete message"
            }), { status: 500 }
        )
    }

}