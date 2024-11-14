'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function BlockPage() {
  const params = useParams()
  const router = useRouter()
  const [recognizedText, setRecognizedText] = useState<string>('')

  useEffect(() => {
    simulateHandwritingRecognition()
  }, [])

  const simulateHandwritingRecognition = () => {
    // This is a placeholder for actual handwriting recognition
    // In a real app, you'd use a proper handwriting recognition API
    const randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = 0; i < 500; i++) {
      result += randomLetters.charAt(Math.floor(Math.random() * randomLetters.length))
      if (i % 50 === 49) result += '\n\n'
      else if (i % 10 === 9) result += ' '
    }
    setRecognizedText(result.trim())
  }

  const handleReturn = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-bold">EduForAll</span>
            </Link>
            <h1 className="text-lg font-semibold">Recognized Text</h1>
          </div>
          <Button variant="secondary" onClick={handleReturn}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Canvas
          </Button>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle className="text-2xl">Recognized Handwriting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg shadow-inner min-h-[calc(100vh-16rem)] max-h-[calc(100vh-16rem)] overflow-y-auto">
              <p className="text-lg whitespace-pre-wrap font-mono leading-relaxed">{recognizedText}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}