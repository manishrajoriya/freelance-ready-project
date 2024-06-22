import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponce } from "@/types/ApiResponce";



export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
 ): Promise<ApiResponce>{
    try {
         await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'gk  Verification code ',
            react: VerificationEmail({ username, otp: verifyCode }),
        });


        return {
            success: true,
            message: "Verification email sent successfully"
        }
        
    } catch (emailError) {
        console.error("Verification email error ", emailError)
        return {
            success: false,
            message: "Error sending verification email"
        }
    }
 }