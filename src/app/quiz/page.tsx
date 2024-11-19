'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['latin'] })

// Sample questions data
const questions = [
  {
    id: 1,
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Processor Unifier", "Central Process Utility"],
    correctAnswer: "Central Processing Unit"
  },
  {
    id: 2,
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: "Stack"
  },
  {
    id: 3,
    question: "What is the time complexity of a binary search?",
    options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    correctAnswer: "O(log n)"
  },
  {
    id: 4,
    question: "Which programming paradigm does JavaScript primarily support?",
    options: ["Procedural", "Object-Oriented", "Functional", "All of the above"],
    correctAnswer: "All of the above"
  },
  {
    id: 5,
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Hyper Text Management Language"],
    correctAnswer: "Hyper Text Markup Language"
  }
]

export default function Component() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer("")
    }
  }

  return (
    <div className={`flex h-screen bg-gray-950 text-cyan-400 ${montserrat.className}`} style={{ color: '#4dffff' }}>
      <div className="flex-1 p-8 relative">
        <div className="absolute top-2 right-5 flex items-center bg-gray-800 px-3 py-1 my-8  rounded-full">
          <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
          <span className="text-xs text-cyan-400">Video Recording</span>
        </div>
        <Card className="bg-gray-900 border-gray-800 text-cyan-400 mt-20">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span className="flex items-center text-blue-400">
                <Clock className="mr-2" />
                {formatTime(timeLeft)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl mb-4">{questions[currentQuestion].question}</h2>
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" onClick={handleNext} disabled={currentQuestion === questions.length - 1}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="w-64 bg-gray-900 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">Question Palette</h3>
        <div className="grid grid-cols-4 gap-2">
          {questions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestion ? "default" : "outline"}
              className={`w-10 h-10 ${index === currentQuestion ? 'bg-cyan-600 text-gray-100' : 'bg-gray-800 text-cyan-400 hover:bg-cyan-700'}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}