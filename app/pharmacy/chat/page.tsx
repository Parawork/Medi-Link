"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PharmacyChatRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/pharmacy/dashboard")
  }, [router])

  return null
}

