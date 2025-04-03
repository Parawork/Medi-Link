"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Paperclip, ImageIcon } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

type Message = {
  id: string
  content: string
  sender: "user" | "pharmacy"
  timestamp: Date
  read: boolean
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      content: "Hello! How can I help you today?",
      sender: "pharmacy",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: true,
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Mock pharmacy data
  const pharmacy = {
    id: params.id,
    name: "MediCare Pharmacy",
    image: "/placeholder.svg?height=40&width=40",
    status: "Online",
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `msg-${messages.length + 1}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
      read: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    // Simulate pharmacy response after a delay
    setTimeout(() => {
      const pharmacyResponses = [
        "I'll check if we have that medication in stock.",
        "Yes, we can fulfill your prescription. Would you like to place an order?",
        "The medicine is available. You can pick it up anytime today.",
        "We offer delivery services if you'd prefer not to come to the store.",
        "Is there anything else you need help with?",
      ]

      const randomResponse = pharmacyResponses[Math.floor(Math.random() * pharmacyResponses.length)]

      const pharmacyMessage: Message = {
        id: `msg-${messages.length + 2}`,
        content: randomResponse,
        sender: "pharmacy",
        timestamp: new Date(),
        read: false,
      }

      setMessages((prev) => [...prev, pharmacyMessage])
    }, 1000)
  }

  const handleAttachment = () => {
    toast({
      title: "Feature coming soon",
      description: "File attachment will be available in the next update.",
    })
  }

  return (
    <div className="container py-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/pharmacies" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pharmacies
          </Link>
        </div>

        <Card className="h-[calc(100vh-180px)] flex flex-col">
          <CardHeader className="border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={pharmacy.image} alt={pharmacy.name} />
                <AvatarFallback>MP</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  {pharmacy.status}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === "user" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className={`text-xs mt-1 ${msg.sender === "user" ? "text-teal-100" : "text-gray-500"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="border-t p-3">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={handleAttachment}>
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleAttachment}>
                <ImageIcon className="h-5 w-5" />
                <span className="sr-only">Attach image</span>
              </Button>
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

