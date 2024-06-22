import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(3,  "Username must be at least 3 characters")
    .max(15, "Username must be at most 15 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must only contain alphanumeric characters and underscores")


export const signupSchema = z.object({
    username: usernameValidation,
    password: z.string().min(6, {message: "Password must be at least 6 characters"}),
    email: z.string().email({message: "Invalid email address"}),
})