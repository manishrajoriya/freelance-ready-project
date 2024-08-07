import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/user";
import {z} from "zod";


export async function POST(request: Request){
    await connectDB()

    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username: decodedUsername})

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        const isCodeValid =  user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()   
            return Response.json(
                {
                    success: true,
                    message: "User verified successfully"
                },
                {
                    status: 200
                }
            )
        }else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Code expired"
                },
                {
                    status: 400
                }
            )
        }else {
            return Response.json(
                {
                    success: false,
                    message: "Invalid code"
                },
                {
                    status: 400
                }
            )
        }
        
    } catch (error) {
        console.error("[SIGNUP] Error in POST /api/signup: ", error)
        return Response.json(
            {
                success: false,
                message: error instanceof z.ZodError ? error.issues : error
            },
            {
                status: 400
            }
        )
    }
}