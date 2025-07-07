"use client"

import { useState } from "react"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, title, description, variant }

    setToasts((current) => [...current, newToast])

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 3000)
  }

  const dismiss = (id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }

  return { toast, toasts, dismiss }
}
