'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react'

interface SetupCheckProps {
  children: React.ReactNode
}

export function SetupCheck({ children }: SetupCheckProps) {
  const [isReady, setIsReady] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkSetup = async () => {
      const newErrors: string[] = []

      // Check environment variables
      try {
        const response = await fetch('/api/init')
        const data = await response.json()
        
        if (!data.ready) {
          if (!data.hasGeminiKey) {
            newErrors.push('GEMINI_API_KEY is not set. Please add it to .env.local')
          }
          if (!data.hasDatabaseUrl) {
            newErrors.push('DATABASE_URL is not set. Please add it to .env.local')
          }
        }
      } catch (error) {
        console.error('[v0] Setup check error:', error)
      }

      setErrors(newErrors)
      setIsReady(newErrors.length === 0)
      setIsChecking(false)
    }

    checkSetup()
  }, [])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-foreground">Initializing application...</p>
        </div>
      </div>
    )
  }

  if (!isReady && errors.length > 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-4">
        <div className="bg-card border border-border rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-bold text-foreground">Setup Required</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Please fix the following issues before using the application:
          </p>
          <ul className="space-y-2">
            {errors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-500 flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 bg-accent/10 border border-accent rounded p-4">
            <p className="text-sm text-foreground mb-2">Steps to fix:</p>
            <ol className="text-xs text-muted-foreground space-y-1">
              <li>1. Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-accent underline">Google Gemini API</a> and get your API key</li>
              <li>2. Open <code className="bg-background px-1 rounded">.env.local</code> file in the project root</li>
              <li>3. Add: <code className="bg-background px-1 rounded">GEMINI_API_KEY=your_key_here</code></li>
              <li>4. Save the file and refresh the browser</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
