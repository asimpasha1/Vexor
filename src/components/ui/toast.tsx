"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { useEffect } from "react"

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        icon: CheckCircle,
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        iconColor: 'text-green-500',
        titleColor: 'text-green-800 dark:text-green-200',
        messageColor: 'text-green-600 dark:text-green-300',
      }
    case 'error':
      return {
        icon: XCircle,
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-500',
        titleColor: 'text-red-800 dark:text-red-200',
        messageColor: 'text-red-600 dark:text-red-300',
      }
    case 'warning':
      return {
        icon: AlertCircle,
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        iconColor: 'text-yellow-500',
        titleColor: 'text-yellow-800 dark:text-yellow-200',
        messageColor: 'text-yellow-600 dark:text-yellow-300',
      }
    case 'info':
      return {
        icon: Info,
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-500',
        titleColor: 'text-blue-800 dark:text-blue-200',
        messageColor: 'text-blue-600 dark:text-blue-300',
      }
  }
}

export function ToastItem({ toast, onRemove }: ToastItemProps) {
  const config = getToastConfig(toast.type)
  const Icon = config.icon

  useEffect(() => {
    const duration = toast.duration || 5000
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        max-w-sm w-full shadow-lg rounded-xl border backdrop-blur-sm
        ${config.bgColor} ${config.borderColor}
        pointer-events-auto
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          
          <div className="mr-3 flex-1">
            <h3 className={`text-sm font-semibold ${config.titleColor}`}>
              {toast.title}
            </h3>
            {toast.message && (
              <p className={`text-sm mt-1 ${config.messageColor}`}>
                {toast.message}
              </p>
            )}
            
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className={`
                    text-sm font-medium underline hover:no-underline
                    ${config.titleColor}
                  `}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          
          <div className="mr-2 flex-shrink-0">
            <button
              onClick={() => onRemove(toast.id)}
              className={`
                rounded-md p-1.5 transition-colors
                hover:bg-black/5 dark:hover:bg-white/10
                ${config.iconColor}
              `}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          className={`h-1 ${config.bgColor} rounded-b-xl overflow-hidden`}
        >
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: toast.duration / 1000, ease: "linear" }}
            className={`h-full ${config.iconColor === 'text-green-500' ? 'bg-green-500' :
              config.iconColor === 'text-red-500' ? 'bg-red-500' :
              config.iconColor === 'text-yellow-500' ? 'bg-yellow-500' :
              'bg-blue-500'
            } opacity-60`}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 left-4 z-50 pointer-events-none">
      <div className="flex flex-col space-y-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={onRemove}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}