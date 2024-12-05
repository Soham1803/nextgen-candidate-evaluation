import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

import { RunnableSequence } from '@langchain/core/runnables'
import { NextResponse } from 'next/server';

import { cleanAndParseJson } from './cleanJSON';

const TEMPLATE = (topic, numberOfQuestions, difficulty) =>  `You are a question generator AI. Generate ${numberOfQuestions} ${difficulty} level questions and their answers about the topic: ${topic}.

Instructions:
1. Difficulty Levels:
   - easy: Basic concept questions suitable for beginners
   - medium: Questions requiring deeper understanding and application
   - hard: Complex questions involving analysis and advanced concepts

2. Response Format:
   Return the response in the following JSON structure:
   {{
     "metadata": {
       "topic": "${topic}",
       "difficulty": "${difficulty}",
       "totalQuestions": ${numberOfQuestions}
     },
     "questions": [
       {
         "question": "<question text>",
         "answer": "<detailed answer>"
       }
     ]
}}

3. Requirements:
   - Generate exactly ${numberOfQuestions} questions
   - Ensure questions match the ${difficulty} difficulty level
   - The question text '<question text>' should be simple text without any special formatting and escape sequence characters
   - Provide clear and accurate answers
   - Return strictly the JSON response with no additional text

Believe in yourself you can do this, you are programmed to do this. Good luck!
`;


export async function POST(req) {
    try {
        const body = await req.json();
        // console.log("Raw body:", body);

        // Verify the body structure
        if (!body) {
            return NextResponse.json({ 
                error: "Invalid request body. Expected a JSON string." 
            }, { status: 400 });
        }

        let currentMessageContent;
        try {
            currentMessageContent = body;
        } catch (parseError) {
            return NextResponse.json({ 
                error: "Failed to parse request body",
                details: parseError.message 
            }, { status: 400 });
        }

        // console.log("Parsed message content:", currentMessageContent);

        const { topic, difficulty, numberOfQuestions } = currentMessageContent;

        // Validate required fields
        if (!topic || !difficulty || !numberOfQuestions) {
            return NextResponse.json({ 
                error: "Missing required fields: topic, difficulty, or numberOfQuestions" 
            }, { status: 400 });
        }

        const prompt = PromptTemplate.fromTemplate(TEMPLATE(topic, numberOfQuestions, difficulty));

        const model = new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_GEMINI_API_KEY,
            model: 'gemini-pro',
            temperature: 1,
            streaming: true,
        });

        // Modify how you're creating messages
        const messages = [
            new SystemMessage(prompt.template),
            new HumanMessage(JSON.stringify(currentMessageContent))
        ];

        const result = await model.invoke(messages);

        const data = result.content;

        // console.log("Stringified data:", JSON.stringify(data));

        const cleanData = cleanAndParseJson(data);  
        const questions = cleanData.questions;   

        // console.log("Generated questions:", cleanData.questions);

        
        return NextResponse.json({ message: questions}, { status: 200 });
    } catch (e) {
        console.error("Full error:", e);
        return NextResponse.json({ 
            error: e.message,
            stack: e.stack 
        }, { status: 500 });
    }
}