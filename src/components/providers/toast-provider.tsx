"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { ToastContainer, Toast, ToastType } from "@/components/ui/toast"

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string, options?: Partial<Toast>) => void
  error: (title: string, message?: string, options?: Partial<Toast>) => void
  warning: (title: string, message?: string, options?: Partial<Toast>) => void
  info: (title: string, message?: string, options?: Partial<Toast>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000, // default 5 seconds
      ...toast,
    }
    
    setToasts((prev) => {
      // Limit to 5 toasts maximum
      const updated = [...prev, newToast]
      return updated.slice(-5)
    })
  }, [])

  const success = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'success',
      title,
      message,
      ...options,
    })
  }, [addToast])

  const error = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'error',
      title,
      message,
      duration: 7000, // errors stay longer
      ...options,
    })
  }, [addToast])

  const warning = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'warning',
      title,
      message,
      ...options,
    })
  }, [addToast])

  const info = useCallback((title: string, message?: string, options?: Partial<Toast>) => {
    addToast({
      type: 'info',
      title,
      message,
      ...options,
    })
  }, [addToast])

  const value: ToastContextType = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}