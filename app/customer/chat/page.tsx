"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CustomerChatRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/customer/dashboard")
  }, [router])

  return null
}

