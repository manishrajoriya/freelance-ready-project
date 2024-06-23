import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].js/options"; 
import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { User } from "next-auth";


export async function POST(request:Request){
    await connectDB()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: "You must be logged in to perform this action" }), { status: 401 })
    }

    const  userID = user._id
    const{acceptMessage} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userID,
            {isAcceptingMessage: acceptMessage},
            {new:true})

            if (!updatedUser) {
                return Response.json(
                    {
                        success:false,
                        message:"failed to update user status to accetp message"
                    },
                    {status:500}
                )
            }

            return Response.json(
                {
                    success:true,
                    message:"user status updated to accetp message",
                    updatedUser
                },{status:200}
            )
    } catch (error) {
        console.log("failed to update user status to accetp message");
        return Response.json({
            success:false,
            message:"failed to update user status to accetp message"
        },{status:500}) 
    }
}


export async function GET(){
    await connectDB()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success:false,
                message:"You must be logged in to perform this action"
            },
            {status:401})

    }

    const  userID = user._id

   try {
     const foundUser = await UserModel.findById(userID)
 
     if (!foundUser) {
         return Response.json(
             {
                 success:false,
                 message:"failed to find user"
             },
             {status:500}
         )
     }
 
     return Response.json(
         {
             success:true,
             message:"user found",
             isAcceptingMessage:foundUser.isAcceptingMessage
         },{status:200}
     )
   } catch (error) {
    console.log("failed to get message acceptance");
    
    return Response.json(
        {
            success:false,
            message:"failed to find user"
        },
        {status:500}
    )
   }
    
}

