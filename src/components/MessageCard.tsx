'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/models/user"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { ApiResponce } from "@/types/ApiResponce"


type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}


function MessageCard({message, onMessageDelete}:MessageCardProps ){
    const {toast } = useToast()
    const handleDeletConfirm = async () => {
      const responce = await axios.delete<ApiResponce>(`/api/delete-message/${message._id}`)

      toast({
        title:responce.data.message
    })
     onMessageDelete(message._id)
     
    }



  return (
   <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>

    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className= 'w-5 h-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeletConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>


    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
   
  </CardContent>
 
</Card>

  )
}

export default MessageCard