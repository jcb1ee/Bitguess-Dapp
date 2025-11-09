import { createContext, useContext, useState, type ReactNode } from 'react'

type LoadingContextType = {
  loadingMessage: string | null
  setLoadingMessage: (message: string | null) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null)

  return (
    <LoadingContext.Provider value={{ loadingMessage, setLoadingMessage }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext)
  if (!context) throw new Error('useLoading must be used within a LoadingProvider')
  return context
}