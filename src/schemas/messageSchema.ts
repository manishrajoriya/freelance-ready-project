import {z} from "zod"

export const MessagesSchema = z.object({
   content: z
   .string()
   .min(10, {message: "Content must be at leate 10 char"})
   .max(100, {message: "Content must be at most 100 char"})
    
})