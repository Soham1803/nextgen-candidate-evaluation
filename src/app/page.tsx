'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight, Brain, Target, Video } from 'lucide-react'

export default function Component() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white">
      <header className="border-b border-blue-900/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            NextGen Candidate Evaluation
          </h1>
          <div className="space-x-4">
            <Button 
              variant="ghost" 
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
              onClick={() => router.push('/login')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold leading-tight">
            Transform Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Hiring Process
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Advanced AI-powered interview platform for evaluating candidates with real-time assessment and comprehensive analytics
          </p>
          <Button 
            size="lg" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg"
            onClick={() => router.push('/login')}
          >
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-[#111318] p-6 rounded-lg border border-blue-900/20">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Video className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Interviews</h3>
            <p className="text-gray-400">Conduct seamless remote interviews with HD video quality and instant recording</p>
          </div>
          <div className="bg-[#111318] p-6 rounded-lg border border-blue-900/20">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Assessment</h3>
            <p className="text-gray-400">Advanced AI algorithms to evaluate technical skills and soft skills in real-time</p>
          </div>
          <div className="bg-[#111318] p-6 rounded-lg border border-blue-900/20">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
            <p className="text-gray-400">Comprehensive reports and insights to make data-driven hiring decisions</p>
          </div>
        </div>
      </main>
    </div>
  )
}