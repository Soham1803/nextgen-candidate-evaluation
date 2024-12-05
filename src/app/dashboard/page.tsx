"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar, Clock, Plus } from "lucide-react";
import { InterviewModal } from "@/components/interview-modal";
import prisma from "@/lib/prismaDb";

interface Interview {
  topic: string;
  date: string;
  time: string;
}

export default function Dashboard() {
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [interview, setInterviews] = useState<Interview>({
    topic: "",
    date: "",
    time: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInterviews({ ...interview, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("INTERVIEW", interview);
    try {
      const dateTime = new Date(`${interview.date} ${interview.time}`);
      const isoDateTime = dateTime.toISOString();
      setTitle(interview.topic);

      const mapdifficulty = (difficulty: string) => {
        switch (difficulty) {
          case "beginner":
            return 1;
          case "intermediate":
            return 2;
          case "advanced":
            return 3;
          default:
            return 1;
        }
      };

      console.log("Difficulty", difficulty);
      // Send the LLM request first and await its completion
      const llm_response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: interview.topic,
          difficulty: difficulty,
          numberOfQuestions: questionCount,
        }),
      });

      if (!llm_response.ok) {
        throw new Error(`LLM request failed: ${llm_response.statusText}`);
      }

      const data = await llm_response.json();
      // console.log("LLM questions", data);
      const questions = data.message;

      
      
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          topic: interview.topic,
          difficulty: Number(mapdifficulty(difficulty)),
          nquestions: Number(questionCount),
          date: isoDateTime,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Interview request failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      // console.log("RESPONSE", result);

      const currInterviewId = result.id;

      const questionData = questions.map((question: any) => {
        return {
          question: question.question,
          answer: question.answer,
          interviewId: currInterviewId,
        };
      });

      const questionResponse = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: questionData,
        }),
      });

      // console.log("QUESTION RESPONSE", questionResponse);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const previousInterviews = [
    {
      id: 1,
      title: "React Fundamentals",
      date: "2023-11-15",
      score: 85,
      eyeContactScore: 80,
      speechScore: 85,
      answerQualityScore: 90,
    },
    {
      id: 2,
      title: "Node.js Basics",
      date: "2023-11-10",
      score: 92,
      eyeContactScore: 95,
      speechScore: 90,
      answerQualityScore: 91,
    },
    {
      id: 3,
      title: "Python Data Structures",
      date: "2023-11-05",
      score: 78,
      eyeContactScore: 75,
      speechScore: 80,
      answerQualityScore: 79,
    },
  ];

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
            <h2 className="text-xl font-semibold mb-4 text-white">
              Previous Interviews
            </h2>
            <div className="grid gap-4">
              {previousInterviews.map((interview) => (
                <Card
                  key={interview.id}
                  className="bg-[#111318] border-blue-900/20 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">
                      {interview.title}
                    </CardTitle>
                    <InterviewModal interview={interview} />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <CardDescription className="text-xs text-gray-400">
                        <Calendar className="h-3 w-3 inline-block mr-1" />
                        {interview.date}
                      </CardDescription>
                      <span className="text-sm font-semibold text-blue-400">
                        Score: {interview.score}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Schedule New Interview
            </h2>
            <Card className="bg-[#111318] border-blue-900/20">
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-white">
                      Topic
                    </Label>
                    <Input
                      name="topic"
                      onChange={handleChange}
                      id="topic"
                      placeholder="e.g. React Hooks"
                      className="bg-[#0A0C10] border-blue-900/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-white">
                      Difficulty Level
                    </Label>
                    <Select
                      name="difficulty"
                      onValueChange={(e) => setDifficulty(e.toString())}
                    >
                      <SelectTrigger className="bg-[#0A0C10] border-blue-900/20 text-white">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="questions" className="text-white">
                      Number of Questions: {questionCount}
                    </Label>
                    <Slider
                      id="questions"
                      name="questions"
                      min={5}
                      max={10}
                      step={1}
                      value={[questionCount]}
                      onValueChange={(e) => setQuestionCount(e[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>5</span>
                      <span>20</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-white">
                      Interview Date
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="date"
                        type="date"
                        name="date"
                        onChange={handleChange}
                        className="bg-[#0A0C10] border-blue-900/20 text-white"
                      />
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-white">
                      Interview Time
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="time"
                        type="time"
                        name="time"
                        onChange={handleChange}
                        step="1"
                        className="bg-[#0A0C10] border-blue-900/20 text-white"
                      />
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400">
                      Enter time in HH:MM:SS format
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Schedule Interview
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
