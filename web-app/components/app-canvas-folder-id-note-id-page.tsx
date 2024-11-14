'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { BookOpen, PenTool, Eraser, RotateCcw, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function BlockPage() {
  const params = useParams()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen')
  const [noteName, setNoteName] = useState('')

  useEffect(() => {
    const folderId = params?.folderId as string
    const noteId = params?.noteId as string

    if (folderId && noteId) {
      setNoteName(`Note ${parseInt(noteId) + 1}`)
    } else {
      setNoteName('Untitled Note')
    }

    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight - 64 // Subtract header height
      const context = canvas.getContext('2d')
      if (context) {
        drawRuledLines(context, canvas.width, canvas.height)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [params])

  const handleResize = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight - 64
      if (context && imageData) {
        context.putImageData(imageData, 0, 0)
        drawRuledLines(context, canvas.width, canvas.height)
      }
    }
  }

  const drawRuledLines = (context: CanvasRenderingContext2D, width: number, height: number) => {
    context.strokeStyle = '#e0e0e0'
    context.lineWidth = 1

    // Draw horizontal lines
    for (let y = 40; y < height; y += 40) {
      context.beginPath()
      context.moveTo(0, y)
      context.lineTo(width, y)
      context.stroke()
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        setIsDrawing(true)
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        context.beginPath()
        context.moveTo(x, y)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        context.lineTo(x, y)
        context.strokeStyle = currentTool === 'pen' ? 'black' : 'white'
        context.lineWidth = currentTool === 'pen' ? 2 : 20
        context.lineCap = 'round'
        context.stroke()
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        drawRuledLines(context, canvas.width, canvas.height)
      }
    }
  }

  const handlePreview = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const imageData = canvas.toDataURL('image/png')
      localStorage.setItem('canvasPreview', imageData)
      router.push('/preview')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-10 h-16">
        <nav className="container mx-auto px-4 h-full flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-bold">EduForAll</span>
            </Link>
            <h1 className="text-lg font-semibold">{noteName}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="secondary" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="secondary">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </nav>
      </header>

      <main className="absolute inset-0 pt-16">
        <div className="absolute top-20 left-4 z-10 flex space-x-2 bg-white p-2 rounded-md shadow-md">
          <Toggle
            pressed={currentTool === 'pen'}
            onPressedChange={() => setCurrentTool('pen')}
            aria-label="Pen tool"
          >
            <PenTool className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={currentTool === 'eraser'}
            onPressedChange={() => setCurrentTool('eraser')}
            aria-label="Eraser tool"
          >
            <Eraser className="h-4 w-4" />
          </Toggle>
          <Button variant="outline" size="icon" onClick={clearCanvas} aria-label="Clear canvas">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="bg-white w-full h-full"
        />
      </main>
    </div>
  )
}