import {
    StreamingTextResponse,
    createStreamDataTransformer
} from 'ai';
// import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';

import { RunnableSequence } from '@langchain/core/runnables'


// console.log("LOADER: ", loader);

export const dynamic = 'force-dynamic'

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
*/
const formatMessage = (message) => {
    return `${message.role}: ${message.content}`;
};

const TEMPLATE = (topic, numberOfQuestions, difficulty) =>  `You are a question generator AI. Generate ${numberOfQuestions} ${difficulty} level questions and their answers about the topic: ${topic}.

Instructions:
1. Difficulty Levels:
   - easy: Basic concept questions suitable for beginners
   - medium: Questions requiring deeper understanding and application
   - hard: Complex questions involving analysis and advanced concepts

2. Response Format:
   Return the response in the following JSON structure:
   {{
     "metadata": {{
       "topic": "${topic}",
       "difficulty": "${difficulty}",
       "totalQuestions": ${numberOfQuestions}
     }},
     "questions": [
       {{
         "question": "<question text>",
         "answer": "<detailed answer>"
       }}
     ]
   }}

3. Requirements:
   - Generate exactly ${numberOfQuestions} questions
   - Ensure questions match the ${difficulty} difficulty level
   - Provide clear and accurate answers
   - Return only the JSON response with no additional text

Believe in yourself you can do this, you are programmed to do this. Good luck!
`;

// console.log("APIKEY: ", process.env.OPENAI_API_KEY);

console.log("OK TILL HERE");
export async function POST(req) {
    // try {
        // Extract the `messages` from the body of the request
        const { messages } = await req.json();
        // console.log("MESSAGES: ", messages)

        const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
        
        const currentMessageContent = JSON.parse(messages[messages.length - 1].content);  
        
        // console.log("CURRENT MESSAGE CONTENT: ", currentMessageContent);
        
        const topic = currentMessageContent['topic'];
        const difficulty = currentMessageContent['difficulty'];
        const numberOfQuestions = currentMessageContent['numberOfQuestions'];

        // console.log("TOPIC: ", topic);
        // console.log("DIFFICULTY: ", difficulty);
        // console.log("NUMBER OF QUESTIONS: ", numberOfQuestions);

            
        const prompt = PromptTemplate.fromTemplate(TEMPLATE(topic, numberOfQuestions, difficulty));

        const model = new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_GEMINI_API_KEY,
            model: 'gemini-pro',
            temperature: 1,
            streaming: true,
        });

        /**
         * Chat models stream message chunks rather than bytes, so this
         * output parser handles serialization and encoding.
        */
       const parser = new HttpResponseOutputParser();
       
       const chain = RunnableSequence.from([
           {
               question: (input) => input.question,
            },
            prompt,
            model,
            parser,
        ]);
        
        // Convert the response into a friendly text-stream
        const stream = await chain.stream({
            chat_history: formattedPreviousMessages.join('\n'),
            question: currentMessageContent,
        });

        const response = new StreamingTextResponse(
            stream.pipeThrough(createStreamDataTransformer()),
        ); 

        console.log("RESPONSE: ", response);
        
        // Respond with the stream
        return response;
    // } catch (e) {
    //     return Response.json({ error: e.message }, { status: e.status ?? 500 });
    // }
}