'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Eye, Mic, Brain, Award } from 'lucide-react'

interface InterviewModalProps {
  interview: {
    id: number
    title: string
    date: string
    score: number
    eyeContactScore: number
    speechScore: number
    answerQualityScore: number
  }
}

export function InterviewModal({ interview }: InterviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Video className="h-4 w-4 text-blue-400 cursor-pointer" onClick={() => setIsOpen(true)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#111318] text-white border-blue-900/20">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-blue-400">{interview.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-400">Date: {interview.date}</p>
          <Card className="bg-[#0A0C10] border-blue-900/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white">Performance Scores</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-400" />
                  <div>
                    <span className="text-sm font-medium">Eye Contact</span>
                    <p className="text-xs text-gray-400">Visual engagement</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold mr-2">{interview.eyeContactScore}%</span>
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: getScoreColor(interview.eyeContactScore)}}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-blue-400" />
                  <div>
                    <span className="text-sm font-medium">Speech Quality</span>
                    <p className="text-xs text-gray-400">Clarity and fluency</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold mr-2">{interview.speechScore}%</span>
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: getScoreColor(interview.speechScore)}}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-400" />
                  <div>
                    <span className="text-sm font-medium">Answer Quality</span>
                    <p className="text-xs text-gray-400">Content and relevance</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold mr-2">{interview.answerQualityScore}%</span>
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: getScoreColor(interview.answerQualityScore)}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#0A0C10] border-blue-900/20">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Award className="h-6 w-6 mr-2 text-blue-400" />
                  <div>
                    <span className="text-base font-medium">Overall Preparation Score</span>
                    <p className="text-xs text-gray-400">Combined performance</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-blue-400 mr-2">{interview.score}%</span>
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: getScoreColor(interview.score)}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#22c55e' // green-500
  if (score >= 70) return '#eab308' // yellow-500
  return '#ef4444' // red-500
}