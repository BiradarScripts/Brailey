'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, PenTool, Users, Accessibility, ChevronRight, Github } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export function BlockPage() {
  const [email, setEmail] = useState('')

  const features = [
    { icon: BookOpen, title: 'Adaptive Learning', description: 'Personalized content that adapts to each student\'s needs' },
    { icon: PenTool, title: 'Interactive Canvas', description: 'Draw and explain concepts with our smart detection technology' },
    { icon: Users, title: 'Collaborative Teaching', description: 'Work together with other educators to create impactful lessons' },
    { icon: Accessibility, title: 'Accessibility First', description: 'Designed from the ground up to be inclusive for all learners' },
  ]
  const router = useRouter();
  const handleClick = () => {
     // replace with the path of the target page
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">EduForAll</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost">Log in</Button>
            <Button>Sign up</Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Inclusive Learning for Every Student
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Empower educators to create accessible, engaging content for all learners, 
            including those with visual impairments.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="max-w-xs" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button size="lg" onClick={handleClick}>
      Get Started
      <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">See EduForAll in Action</h2>
          <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto">
            <img 
              src="./screenshot.png"
              alt=" in Action"
              className="w-full h-full rounded-lg shadow-lg"
            />
          </div>
        </div>


        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with educators worldwide and share your experiences in creating 
            inclusive learning environments.
          </p>
          <Button size="lg">
            <Github className="mr-2 h-5 w-5" />
            Join us on GitHub
          </Button>
        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">EduForAll</span>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Blog</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Privacy</Link>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
            © 2023 EduForAll. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}