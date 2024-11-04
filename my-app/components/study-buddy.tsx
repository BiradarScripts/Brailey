'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, File, Search, Plus, Moon, Sun, Type, Pen, Save, Eraser, Bold, Italic, List, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface Note {
  id: string
  title: string
  content: string
  type: 'text' | 'drawing'
  drawingData?: string
  textFormatting?: {
    bold: boolean
    italic: boolean
    alignment: 'left' | 'center' | 'right'
  }
}

interface Folder {
  id: string
  name: string
  color: string
  notes: Note[]
}

export function StudyBuddyComponent() {
  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', name: 'Math', color: 'bg-red-500', notes: [] },
    { id: '2', name: 'Science', color: 'bg-blue-500', notes: [] },
    { id: '3', name: 'History', color: 'bg-green-500', notes: [] },
  ])
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingColor, setDrawingColor] = useState('#000000')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [activeTab, setActiveTab] = useState<'text' | 'drawing'>('text')

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.lineCap = 'round'
        context.strokeStyle = drawingColor
        context.lineWidth = 2
        contextRef.current = context
      }
    }
  }, [drawingColor])

  useEffect(() => {
    if (activeNote && activeNote.type === 'drawing' && canvasRef.current && contextRef.current) {
      const canvas = canvasRef.current
      const context = contextRef.current
      if (activeNote.drawingData) {
        const img = new Image()
        img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.drawImage(img, 0, 0)
        }
        img.src = activeNote.drawingData
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [activeNote])

  const handleCreateFolder = () => {
    if (newFolderName) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName,
        color: `bg-${['red', 'blue', 'green', 'yellow', 'purple'][Math.floor(Math.random() * 5)]}-500`,
        notes: [],
      }
      setFolders([...folders, newFolder])
      setNewFolderName('')
    }
  }

  const handleCreateNote = (type: 'text' | 'drawing') => {
    if (activeFolder) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: `New ${type === 'text' ? 'Text' : 'Drawing'} Note`,
        content: '',
        type: type,
        drawingData: type === 'drawing' ? '' : undefined,
        textFormatting: type === 'text' ? { bold: false, italic: false, alignment: 'left' } : undefined,
      }
      const updatedFolders = folders.map(folder => 
        folder.id === activeFolder ? { ...folder, notes: [...folder.notes, newNote] } : folder
      )
      setFolders(updatedFolders)
      setActiveNote(newNote)
      setActiveTab(type)
    }
  }

  const handleSaveNote = () => {
    if (activeFolder && activeNote) {
      let updatedNote = { ...activeNote }
      if (activeNote.type === 'drawing' && canvasRef.current) {
        updatedNote.drawingData = canvasRef.current.toDataURL()
      }
      const updatedFolders = folders.map(folder => {
        if (folder.id === activeFolder) {
          const updatedNotes = folder.notes.map(note => 
            note.id === activeNote.id ? updatedNote : note
          )
          return { ...folder, notes: updatedNotes }
        }
        return folder
      })
      setFolders(updatedFolders)
      setActiveNote(updatedNote)
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (contextRef.current) {
      const { offsetX, offsetY } = e.nativeEvent
      contextRef.current.beginPath()
      contextRef.current.moveTo(offsetX, offsetY)
      setIsDrawing(true)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return
    const { offsetX, offsetY } = e.nativeEvent
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath()
      setIsDrawing(false)
    }
  }

  const clearCanvas = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const handleTextFormatting = (type: 'bold' | 'italic' | 'alignment', value?: 'left' | 'center' | 'right') => {
    if (activeNote && activeNote.type === 'text' && activeNote.textFormatting) {
      const updatedFormatting = { ...activeNote.textFormatting }
      if (type === 'alignment' && value) {
        updatedFormatting.alignment = value
      } else if (type === 'bold' || type === 'italic') {
        updatedFormatting[type] = !updatedFormatting[type]
      }
      setActiveNote({ ...activeNote, textFormatting: updatedFormatting })
    }
  }

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">StudyBuddy</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">Toggle dark mode</span>
          </Button>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <ScrollArea className="flex-grow">
          {filteredFolders.map(folder => (
            <div
              key={folder.id}
              className={`flex items-center p-2 rounded-md cursor-pointer mb-2 ${
                activeFolder === folder.id ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
              onClick={() => setActiveFolder(folder.id)}
            >
              <Folder className={`mr-2 ${folder.color} text-white rounded p-1`} />
              <span>{folder.name}</span>
            </div>
          ))}
        </ScrollArea>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 bg-white dark:bg-gray-900">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {activeFolder ? folders.find(f => f.id === activeFolder)?.name : 'Select a folder'}
          </h2>
          <div className="flex space-x-2">
            <Button onClick={() => handleCreateNote('text')}>
              <Type className="mr-2 h-4 w-4" /> New Text Note
            </Button>
            <Button onClick={() => handleCreateNote('drawing')}>
              <Pen className="mr-2 h-4 w-4" /> New Drawing Note
            </Button>
          </div>
        </div>

        {activeFolder && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 border-r pr-4">
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <ScrollArea className="h-[calc(100vh-200px)]">
                {folders.find(f => f.id === activeFolder)?.notes.map(note => (
                  <div
                    key={note.id}
                    className={`p-2 mb-2 cursor-pointer rounded flex items-center ${
                      activeNote?.id === note.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                    }`}
                    onClick={() => {
                      setActiveNote(note)
                      setActiveTab(note.type)
                    }}
                  >
                    {note.type === 'text' ? (
                      <Type className="mr-2 h-4 w-4" />
                    ) : (
                      <Pen className="mr-2 h-4 w-4" />
                    )}
                    <span>{note.title}</span>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="col-span-2">
              {activeNote ? (
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'drawing')}>
                  <TabsList>
                    <TabsTrigger value="text" disabled={activeNote.type !== 'text'}>Text</TabsTrigger>
                    <TabsTrigger value="drawing" disabled={activeNote.type !== 'drawing'}>Drawing</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text">
                    <div className="space-y-4">
                      <Input
                        type="text"
                        value={activeNote.title}
                        onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
                        className="text-xl font-bold"
                        placeholder="Note Title"
                      />
                      <div className="flex items-center space-x-2 mb-2">
                        <ToggleGroup type="multiple" variant="outline">
                          <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => handleTextFormatting('bold')}>
                            <Bold className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => handleTextFormatting('italic')}>
                            <Italic className="h-4 w-4" />
                          </ToggleGroupItem>
                        </ToggleGroup>
                        <ToggleGroup type="single" variant="outline">
                          <ToggleGroupItem value="left" aria-label="Align left" onClick={() => handleTextFormatting('alignment', 'left')}>
                            <AlignLeft className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="center" aria-label="Align center" onClick={() => handleTextFormatting('alignment', 'center')}>
                            <AlignCenter className="h-4 w-4" />
                          </ToggleGroupItem>
                          <ToggleGroupItem value="right" aria-label="Align right" onClick={() => handleTextFormatting('alignment', 'right')}>
                            <AlignRight className="h-4 w-4" />
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      <Textarea
                        value={activeNote.content}
                        onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
                        className={`min-h-[300px] ${
                          activeNote.textFormatting?.bold ? 'font-bold' : ''
                        } ${
                          activeNote.textFormatting?.italic ? 'italic' : ''
                        } text-${activeNote.textFormatting?.alignment}`}
                        placeholder="Start typing your notes here..."
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="drawing">
                    <div className="space-y-4">
                      <Input
                        type="text"
                        
                        value={activeNote.title}
                        onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
                        className="text-xl font-bold"
                        placeholder="Drawing Title"
                      />
                      <div className="border p-2 rounded-md">
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={400}
                          className="border rounded-md cursor-crosshair w-full h-[400px]"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                        />
                        <div className="flex items-center mt-2 space-x-2">
                          <input
                            type="color"
                            value={drawingColor}
                            onChange={(e) => setDrawingColor(e.target.value)}
                            className="w-8 h-8"
                          />
                          <Button onClick={clearCanvas} variant="outline" size="sm">
                            <Eraser className="mr-2 h-4 w-4" /> Clear Canvas
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <p>Select or create a note to start</p>
              )}
              {activeNote && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleSaveNote}>
                    <Save className="mr-2 h-4 w-4" /> Save Note
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}