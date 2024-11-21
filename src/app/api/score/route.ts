import prisma from "@/lib/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        const { eye_contact, speech_quality, answer_quality, total_score, userId, interviewId } = await req.json();

        if(!eye_contact || !speech_quality || !answer_quality || !total_score || !userId || !interviewId){
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const user = await prisma.score.create({
            data: {
                eye_contact,
                speech_quality,
                answer_quality,
                total_score,
                userId,
                interviewId,

            }
        });
        return NextResponse.json(user);
    } catch (error){
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}