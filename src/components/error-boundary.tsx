"use client"

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              حدث خطأ مؤقت
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              نعمل على حل المشكلة، يرجى المحاولة مرة أخرى
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}