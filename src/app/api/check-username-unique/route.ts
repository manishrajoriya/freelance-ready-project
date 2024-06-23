import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/user";
import {z} from "zod";

import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request:Request) {
   

    await connectDB();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        };
        //validation with zod 
       const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(request);
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameError,
                    message2: "An error occurred while checking the username"
                },
                {status: 400}
            )
        }

        const { username } = result.data;

       const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

       if (existingVerifiedUser) {
        return Response.json(
            {
                success: false,
                message: "Username alredy taken"
            },
            {status: 400}
        )
       }

       return Response.json(
        {
            success: true,
            message: "Username available"
        }
    )
       
    } catch (error) {
        console.error("Cecking username",error);
        return  Response.json(
            {
                success: false,
                message: "An error occurred while checking the username"
            },
            {status: 500}
        )
    }
}