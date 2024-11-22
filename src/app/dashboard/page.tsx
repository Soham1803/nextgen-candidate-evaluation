'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calendar, Clock, Plus } from 'lucide-react'

export default function Dashboard() {
  const [topic, setTopic] = useState('')
  const [difficultyLevel, setDifficultyLevel] = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const { messages, setInput, handleSubmit: handleLLMSubmit } = useChat({
    api: '/api/llm',
  })

  const handleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // First, get questions from LLM
    const llmInput = JSON.stringify({
      topic,
      numberOfQuestions: questionCount,
      difficulty: difficultyLevel,
    })
    setInput(llmInput)
    await handleLLMSubmit(e)

    console.log("MESSAGES: ", messages)

    // Then, schedule the interview
    const response = await fetch('/api/interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: topic,
        topic,
        difficulty: difficultyLevel,
        nquestions: questionCount,
        date,
      }),
    })

    if (response.ok) {
      console.log('Interview scheduled successfully')
      // Reset form fields
      setTopic('')
      setDifficultyLevel('')
      setQuestionCount(10)
      setDate('')
      setTime('')
    } else {
      console.error('Failed to schedule interview')
    }
  }

  const previousInterviews = [
    { id: 1, title: "React Fundamentals", date: "2023-11-15", score: 85, eyeContactScore: 80, speechScore: 85, answerQualityScore: 90 },
    { id: 2, title: "Node.js Basics", date: "2023-11-10", score: 92, eyeContactScore: 95, speechScore: 90, answerQualityScore: 91 },
    { id: 3, title: "Python Data Structures", date: "2023-11-05", score: 78, eyeContactScore: 75, speechScore: 80, answerQualityScore: 79 },
    { id: 4, title: "Rust Programming Essentials", date: "2023-11-20", score: 88, eyeContactScore: 85, speechScore: 87, answerQualityScore: 90 },
    { id: 5, title: "Advanced CSS Techniques", date: "2023-11-25", score: 91, eyeContactScore: 92, speechScore: 90, answerQualityScore: 94 },
    { id: 6, title: "Docker and Kubernetes Basics", date: "2023-12-01", score: 83, eyeContactScore: 80, speechScore: 85, answerQualityScore: 88 },

  ]

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-700">
      <header className="border-b border-blue-900/20">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            NextGen Candidate Evaluation Dashboard
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">Previous Interviews</h2>
            <div className="grid gap-4">
              {previousInterviews.map((interview) => (
                <Card key={interview.id} className="bg-[#111318] border-blue-900/20 transition-all duration-300 ease-in-out transform hover:scale-105">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">{interview.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <CardDescription className="text-xs text-gray-400">
                        <Calendar className="h-3 w-3 inline-block mr-1" />
                        {interview.date}
                      </CardDescription>
                      <span className="text-sm font-semibold text-blue-400">Score: {interview.score}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">Schedule New Interview</h2>
            <Card className="bg-[#111318] border-blue-900/20">
              <CardContent className="pt-6">
                <form onSubmit={handleInterviewSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-white">Topic</Label>
                    <Input 
                      id="topic" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. React Hooks" 
                      className="bg-[#0A0C10] border-blue-900/20 text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-white">Difficulty Level</Label>
                    <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                      <SelectTrigger className="bg-[#0A0C10] border-blue-900/20 text-white">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="questions" className="text-white">Number of Questions: {questionCount}</Label>
                    <Slider
                      id="questions"
                      min={5}
                      max={20}
                      step={1}
                      value={[questionCount]}
                      onValueChange={(value) => setQuestionCount(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>5</span>
                      <span>20</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-white">Interview Date</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-[#0A0C10] border-blue-900/20 text-white"
                      />
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-white">Interview Time</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="time"
                        type="time"
                        step="1"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-[#0A0C10] border-blue-900/20 text-white"
                      />
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400">Enter time in HH:MM:SS format</p>
                  </div>
                  <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Schedule Interview
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}