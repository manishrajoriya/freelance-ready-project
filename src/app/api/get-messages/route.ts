import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].js/options"; 
import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function POST(request:Request){
    await connectDB()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success:false,
                message:"Not Authentication"
            },{status:401}
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id: "$_id", messages: {$push: "$messages"}}}
        ])
        if (!user || user.length === 0) {
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
                messages:user[0].messages
            },
            {status:200}
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