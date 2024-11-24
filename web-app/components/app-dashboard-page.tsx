'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, File, Plus, PenTool, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function BlockPage() {
  const [folders, setFolders] = useState([
    { id: 1, name: 'Hindi', notes: ['Lecture-1', 'Lecture-2', 'Lecture-3'] },
    { id: 2, name: 'English', notes: ['Lecture-1', 'Lecture-2', 'Lecture-3'] },
    { id: 3, name: 'Portugese', notes: ['Lecture-1', 'Lecture-2', 'Lecture-3'] },
    { id: 3, name: 'French', notes: ['Lecture-1', 'Lecture-2', 'Lecture-3'] },
  ])

  const router = useRouter();
  const handleClick = () => {
    // replace with the path of the target page
   router.push('/canvas');
 };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">EduForAll</span>
          </div>
          <Button variant="outline">Log out</Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Learning Materials</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Folder className="mr-2" size={20} />
                    {folder.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {folder.notes.map((note, noteIndex) => (
                      <li key={noteIndex} className="flex justify-between items-center">
                        <span className="flex items-center">
                          <File className="mr-2" size={16} />
                          {note}
                        </span>
                        <div>
                        <Button variant="outline" size="sm" className="mr-2" onClick={handleClick}>
                          <PenTool className="mr-2" size={16} />
                          Edit
                        </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button>
            <Plus className="mr-2" size={16} />
            New Folder
          </Button>
        </div>
      </main>
    </div>
  )
}