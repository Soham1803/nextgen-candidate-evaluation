'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, ChevronLeft, ChevronRight, Video, VideoOff, Minimize2, Maximize2, Download } from 'lucide-react'
import { Montserrat } from 'next/font/google'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CardFooter } from "@/components/ui/card"

const montserrat = Montserrat({ subsets: ['latin'] })

// Sample questions data
const questions = [
  {
    id: 1,
    question: "What does CPU stand for?",
    correctAnswer: "Central Processing Unit"
  },
  {
    id: 2,
    question: "Which data structure uses LIFO (Last In First Out)?",
    correctAnswer: "Stack"
  },
  {
    id: 3,
    question: "What is the time complexity of a binary search?",
    correctAnswer: "O(log n)"
  },
  {
    id: 4,
    question: "Which programming paradigm does JavaScript primarily support?",
    correctAnswer: "All of the above"
  },
  {
    id: 5,
    question: "What does HTML stand for?",
    correctAnswer: "Hyper Text Markup Language"
  },
  {
    id: 6,
    question: "What does RAM stand for?",
    correctAnswer: "Random Access Memory"
  },
  {
    id: 7,
    question: "Which sorting algorithm has the best average-case time complexity?",
    correctAnswer: "Merge Sort"
  },
  {
    id: 8,
    question: "What is the primary purpose of an operating system?",
    correctAnswer: "To manage hardware and software resources"
  },
  {
    id: 9,
    question: "Which keyword is used to declare a constant in JavaScript?",
    correctAnswer: "const"
  },
  {
    id: 10,
    question: "What is the function of a compiler?",
    correctAnswer: "To translate source code into machine code"
  }
]

export default function Component() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [isRecording, setIsRecording] = useState(false)
  const [showCameraCheck, setShowCameraCheck] = useState(true)
  const [cameraReady, setCameraReady] = useState(false)
  const [isVideoExpanded, setIsVideoExpanded] = useState(false)
  const [showDownloadDialog, setShowDownloadDialog] = useState(false)
  const [downloadFileName, setDownloadFileName] = useState('interview-recording')
  const [isInterviewComplete, setIsInterviewComplete] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const smallVideoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    if (cameraReady && !isRecording && timeLeft > 0) {
      startRecording()
    }
  }, [cameraReady, isRecording, timeLeft])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cameraReady && timeLeft > 0 && !isInterviewComplete) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            handleSubmit()
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cameraReady, timeLeft, isInterviewComplete])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      if (smallVideoRef.current) {
        smallVideoRef.current.srcObject = stream
      }
      setCameraReady(true)
      setShowCameraCheck(false)
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const startRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      mediaRecorderRef.current = new MediaRecorder(videoRef.current.srcObject as MediaStream)
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const toggleVideoSize = () => {
    setIsVideoExpanded(!isVideoExpanded)
  }

  const handleDownload = () => {
    const blob = new Blob(chunksRef.current, { type: 'video/webm' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    a.href = url
    a.download = `${downloadFileName}.webm`
    a.click()
    window.URL.revokeObjectURL(url)
    setShowDownloadDialog(false)
  }

  const handleSubmit = () => {
    stopRecording()
    setIsInterviewComplete(true)
    setShowDownloadDialog(true)
  }

  return (
    <div className={`flex h-screen bg-gray-950 text-cyan-400 ${montserrat.className}`} style={{ color: '#4dffff' }}>
      <div className="flex-1 p-8 relative">
        <div className="absolute top-2 right-5 flex items-center bg-gray-800 px-3 py-1 my-8 rounded-full">
          <div className={`w-2 h-2 ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-gray-400'} rounded-full mr-2`}></div>
          <span className="text-xs text-cyan-400">{isRecording ? 'Recording' : 'Not Recording'}</span>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" onClick={handleNext} disabled={currentQuestion === questions.length - 1}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
          <CardFooter className="flex justify-center mt-4">
            <Button onClick={handleSubmit} variant="default">
              Submit Interview
            </Button>
          </CardFooter>
        </Card>
        <div className={`fixed ${isVideoExpanded ? 'inset-0 z-50 bg-gray-950/90' : 'bottom-4 right-4'} transition-all duration-300 ease-in-out`}>
          <div className={`relative ${isVideoExpanded ? 'w-full h-full' : 'w-48 h-36'}`}>
            <video ref={smallVideoRef} autoPlay muted className="w-full h-full object-cover rounded-lg" />
            <Button
              className="absolute top-2 right-2 bg-gray-800/50 hover:bg-gray-700/50"
              size="icon"
              onClick={toggleVideoSize}
              aria-label={isVideoExpanded ? "Minimize video" : "Maximize video"}
            >
              {isVideoExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
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
      <Dialog open={showCameraCheck} onOpenChange={setShowCameraCheck}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Camera Check</DialogTitle>
            <DialogDescription>
              Please enable your camera to start the interview. Your video will be recorded during the interview.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <video ref={videoRef} autoPlay muted className="w-full max-w-sm rounded-lg" />
          </div>
          <DialogFooter>
            <Button onClick={startCamera}>
              {cameraReady ? <Video className="mr-2 h-4 w-4" /> : <VideoOff className="mr-2 h-4 w-4" />}
              {cameraReady ? 'Camera Ready' : 'Enable Camera'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Recording</DialogTitle>
            <DialogDescription>
              Your interview recording is ready. Please enter a name for your file and click download.
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              type="text"
              id="fileName"
              value={downloadFileName}
              onChange={(e) => setDownloadFileName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}