'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, PenTool, Eraser, RotateCcw, Save, ChevronUp, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
//import script
import Script from 'next/script'
import * as iink from 'iink-ts';




export default function BlockPage() {
  const params = useParams()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen')
  const [noteName, setNoteName] = useState('')
  const [recognizedText, setRecognizedText] = useState('')
  const [isTextPanelOpen, setIsTextPanelOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const editorRef=useRef(null)

  useEffect(() => {

    const initializeEditor = async () => {
      if (!editorRef.current) {
        console.error("Editor container is not available.");
        return;
      }
    
      const options = {
        configuration: {
          server: {
            protocol: "WEBSOCKET",
            scheme: "https",
            host: "cloud.myscript.com",
            applicationKey: "fb55b762-cd1f-4c46-a29f-7f7a6643b0b7",
            hmacKey: "56ecf833-4567-4195-addd-df5063c5eb8f",
          },
          recognition: {
            type: "TEXT",
          },
        },
      };
    
      try {
        // Create a new editor instance
        const editor = new iink.Editor(editorRef.current, options);
    
        // Store the editor instance in a ref (if needed elsewhere)
        editorRef.current.editorInstance = editor;
    
        // Await the asynchronous initialization
        await editor.initialize();
    
        // Add event listener for the "exported" event
        editor.events.addEventListener("exported", async (event) => {
          const data = event.detail?.["application/vnd.myscript.jiix"];
          if (data?.label) {
            const recognizedText = data.label; // The recognized text from the editor
    
            // Call the function to send recognized text to the server
            setRecognizedText(recognizedText);
            await sendRecognizedTextToServer(recognizedText);
          } else {
            console.log("No valid exported data found.");
          }
        });
    
        // Add window resize listener to adjust the editor
        const handleResize = () => editor.resize();
        window.addEventListener("resize", handleResize);
    
        // Cleanup function (for unmount or reinitialization)
        return () => {
          editor.events.removeEventListener("exported", () => {
            console.log("Exported event listener removed.");
          });
          window.removeEventListener("resize", handleResize);
          editor.close();
          console.log("Editor instance cleaned up.");
        };
      } catch (error) {
        console.error("Failed to initialize the editor:", error);
      }
    };
    
    // Function to send recognized text to the server via POST request
    
    const sendRecognizedTextToServer = async (recognizedText) => {
      try {
<<<<<<< HEAD
        const response = await fetch('https://1a8b-34-74-80-250.ngrok-free.app/data', {
=======
        const response = await fetch('https://1883-35-184-246-210.ngrok-free.app/data', {
>>>>>>> 4948e3c696002c7193e771ee0b4e7135a8384419
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recognizedText: recognizedText,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to send recognized text to server');
        }
    
        const data = await response.json();
        console.log('Server response:', data);
      } catch (error) {
        console.error('Error sending recognized text to server:', error);
      }
    };
    
    

    // Call the async function
   

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
    initializeEditor();
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
    simulateHandwritingRecognition()
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
    setRecognizedText('')
  }

  const simulateHandwritingRecognition = () => {
    // This is a placeholder for actual handwriting recognition
    // In a real app, you'd use a proper handwriting recognition API
    const randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = 0; i < 100; i++) {
      result += randomLetters.charAt(Math.floor(Math.random() * randomLetters.length))
      if (i % 20 === 19) result += '\n'
    }
    setRecognizedText(prevText => prevText + result.trim() + '\n')
  }

  const toggleTextPanel = () => {
    setIsTextPanelOpen(!isTextPanelOpen)
  }

  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md z-20">
        <nav className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-bold">EduForAll</span>
            </Link>
            <h1 className="text-lg font-semibold">{noteName}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <div className="flex space-x-2 bg-white/10 p-1 rounded-md">
              <Toggle
                pressed={currentTool === 'pen'}
                onPressedChange={() => setCurrentTool('pen')}
                aria-label="Pen tool"
                className="bg-white/20 data-[state=on]:bg-white/40"
              >
                <PenTool className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={currentTool === 'eraser'}
                onPressedChange={() => setCurrentTool('eraser')}
                aria-label="Eraser tool"
                className="bg-white/20 data-[state=on]:bg-white/40"
              >
                <Eraser className="h-4 w-4" />
              </Toggle>
              <Button variant="ghost" size="icon" onClick={clearCanvas} aria-label="Clear canvas">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow relative overflow-hidden">
        {/* <canvas
          ref={editorRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="absolute inset-0 bg-white"
        /> */}

        <div id="editor" ref={editorRef} touch-action="none"></div>
        
        <div className={`absolute inset-x-0 bottom-0 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${isTextPanelOpen ? 'translate-y-0' : 'translate-y-full'}`} style={{height: 'calc(50vh - 32px)'}}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Recognized Text</h2>
            <Button variant="outline" size="sm" onClick={toggleEditing}>
              <Edit2 className="h-4 w-4 mr-2" />
<<<<<<< HEAD
              {isEditing ? 'View' : 'Ask Ai'}
            </Button>
            {/* <Button variant="outline" size="sm" onClick={toggleEditing}>
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? 'View' : 'Edit'}
            </Button> */}
=======
              {isEditing ? 'View' : 'Edit'}
            </Button>
>>>>>>> 4948e3c696002c7193e771ee0b4e7135a8384419
          </div>
          <div className="p-4 h-full overflow-hidden">
            {isEditing ? (
              <Textarea
                value={recognizedText}
                onChange={(e) => setRecognizedText(e.target.value)}
                className="w-full h-full resize-none focus:ring-2 focus:ring-blue-500"
                placeholder="Edit recognized text here..."
              />
            ) : (
              <div className="h-full overflow-y-auto">
                <p className="text-lg whitespace-pre-wrap font-mono leading-relaxed">{recognizedText}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-lg z-10"
        onClick={toggleTextPanel}
      >
        <ChevronUp className={`h-6 w-6 transition-transform duration-300 ${isTextPanelOpen ? 'rotate-180' : ''}`} />
      </Button>

      <Script
        src="/node_modules/iink-ts/dist/iink.min.js"
        strategy="afterInteractive"
      />
    </div>
  )
}