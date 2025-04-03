"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PharmacySidebar from "@/components/pharmacy-sidebar"
import { ChevronLeft, Paperclip, ImageIcon, Send, Smile } from "lucide-react"
import Link from "next/link"

type Message = {
  id: string
  content: string
  sender: "pharmacy" | "customer"
  timestamp: Date
  seen: boolean
}

type Customer = {
  id: string
  name: string
  avatar: string
  lastSeen: string
}

export default function PharmacyChatPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== "pharmacy") {
      router.push("/login")
      return
    }

    setUser(parsedUser)

    // Mock customer data
    setCustomer({
      id: params.id,
      name: "Parakrama",
      avatar: "/placeholder.svg?height=40&width=40",
      lastSeen: "a few minutes",
    })

    // Mock messages
    setMessages([
      {
        id: "1",
        content: "Hi there! Is Monodril available",
        sender: "customer",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        seen: true,
      },
      {
        id: "2",
        content: "Okay.\nI will reply you later",
        sender: "customer",
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        seen: true,
      },
      {
        id: "3",
        content: "Yeah, what brand do you need",
        sender: "pharmacy",
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        seen: true,
      },
      {
        id: "4",
        content: "Have a nice day!",
        sender: "pharmacy",
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
        seen: false,
      },
      {
        id: "5",
        content: "Our outlet location - https://maps.app.goo.gl/KYZg1g6TmKnZpFQ7",
        sender: "pharmacy",
        timestamp: new Date(),
        seen: false,
      },
    ])
  }, [router, params.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: "pharmacy",
      timestamp: new Date(),
      seen: false,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  if (!user || !customer) {
    return null // Loading state
  }

  return (
    <div className="flex min-h-screen bg-white">
      <PharmacySidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#0a2351] text-white p-4 flex items-center">
          <div className="container mx-auto flex items-center">
            <h1 className="text-xl font-medium">Chat</h1>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="bg-[#0a2351] text-white p-4">
            <div className="flex items-center">
              <Link href="/pharmacy/orders" className="mr-4">
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={customer.avatar || "/placeholder.svg"}
                    alt={customer.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-medium">{customer.name}</h2>
                  <p className="text-xs opacity-80">{customer.lastSeen ? `${customer.lastSeen}` : "Offline"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "pharmacy" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "customer" && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-500 mr-2">
                      <span className="text-lg">⚡</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "pharmacy" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    <div
                      className={`text-xs mt-1 ${message.sender === "pharmacy" ? "text-blue-200" : "text-gray-500"}`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {message.sender === "pharmacy" && <span className="ml-1">{message.seen ? "Seen" : ""}</span>}
                    </div>
                  </div>
                  {message.sender === "pharmacy" && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-500 ml-2">
                      <span className="text-lg">⚡</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat input */}
          <div className="border-t p-3">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-3xl mx-auto">
              <Button type="button" variant="ghost" size="icon" className="text-gray-500">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="text-gray-500">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a reply..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

