'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message, User } from "@/models/user"
import { AcceptMessagesSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponce } from "@/types/ApiResponce"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

function page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)


  const {toast } = useToast()

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message.id !== messageId))
    toast({
      title: "Message deleted",
      description: "The message has been deleted successfully.",
    })

    const {data: session} = useSession()

    const form = useForm({
      resolver: zodResolver(AcceptMessagesSchema)
    })

    const {register, watch, setValue}  =  form

    const acceptMessages = watch("acceptMessage")

    const featchAcceptMessage = useCallback(async () => {
      setIsSwitchLoading(true)
      try {
        const res = await axios.get<ApiResponce>(`/api/accept-messages`)
         setValue("acceptMessage", res.data.isAcceptingMessage)
        
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponce>
        toast({
          title: "Error",
          description: "An error occurred while fetching the data.",
          variant: "destructive",
        })
      } finally {
        setIsSwitchLoading(false)
      }
    }, [setValue])


    const fetchMessages = useCallback(async (refresh: boolean = false)=>{
      setIsLoading(true)
      setIsSwitchLoading(false)
      try {
        const responce= await axios.get<ApiResponce>('api/get-messages')
        setMessages(responce.data.messages || [])
        if (refresh) {
          toast({
            title: "Messages refreshed",
            description: "The messages have been refreshed successfully.",
          })
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponce>
        toast({
          title: "Error",
          description: "An error occurred while fetching the data 2.",
          variant: "destructive",
        })
      }finally{
        setIsLoading(false)
        setIsSwitchLoading(false)
      }

    },[setIsLoading, setMessages])

    useEffect(( ) => {
      if (!session || !session.user) return

      fetchMessages()
      featchAcceptMessage()

    },[session, setValue, featchAcceptMessage, fetchMessages])

    // handle switch change
    const handleSwitchChange = async () => {
      try {
       const responce =  await axios.post<ApiResponce>("/api/accept-messages", {
          acceptMessage: !acceptMessages,
        })

        setValue("acceptMessage", !acceptMessages)
        toast({
          title: responce.data.message,
          variant: "default"
        })
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponce>
        toast({
          title: "Error",
          description: axiosError.response?.data?.message || "An error occurred while updating the status.",
          variant: "destructive",
        })
      }
    }

    if (!session || !session.user) {
      return <div>Login Please...</div>
    }


    const {username} = session?.user as User

    //todo do more research on this
    const baseUrl = `${window.location.protocol}/${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl)
      toast({
        title: "Copied to clipboard",
        description: "The URL has been copied to your clipboard.",
      })

  }
    return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          
          <Input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );

}
}
export default page


