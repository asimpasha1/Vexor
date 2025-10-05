"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => {
      if (typeof window !== 'undefined') {
        return (localStorage.getItem(storageKey) as Theme) || defaultTheme
      }
      return defaultTheme
    }
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    console.log('Theme changed to:', theme) // للتشخيص
    const root = window.document.documentElement
    const body = window.document.body

    // إزالة كلاسات الثيم الموجودة
    root.classList.remove("light", "dark")
    body.classList.remove("light", "dark")

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      console.log('System theme detected:', systemTheme) // للتشخيص
      root.classList.add(systemTheme)
      body.classList.add(systemTheme)
      return
    }

    console.log('Applying theme class:', theme) // للتشخيص
    root.classList.add(theme)
    body.classList.add(theme)
    
    // إضافة التحقق من تطبيق الكلاس
    setTimeout(() => {
      console.log('Root classes after applying theme:', root.className)
      console.log('Body classes after applying theme:', body.className)
    }, 100)
  }, [theme, enableSystem])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      console.log('Setting theme to:', theme) // للتشخيص
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, theme)
      }
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}