import prisma from "@/lib/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, params: { userId: string, interviewId: string }){
    try{
        const score = await prisma.score.findUnique({
            where: {
                userId_interviewId: {
                    userId: parseInt(params.userId),
                    interviewId: parseInt(params.interviewId),
                }
            }
        });
        if(!score){
            return NextResponse.json({ error: "Score not found" }, { status: 404 });
        }
        return NextResponse.json(score);
    } catch (error){
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

}

export async function PUT(req: NextRequest, params: { userId: string, interviewId: string }){
    try{
        const { eye_contact, speech_quality, answer_quality, total_score } = await req.json();

        if(!eye_contact || !speech_quality || !answer_quality || !total_score){
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const updatedScore = await prisma.score.update({
            where: {
                userId_interviewId: {
                    userId: parseInt(params.userId),
                    interviewId: parseInt(params.interviewId),
                }
            },
            data: {
                eye_contact,
                speech_quality,
                answer_quality,
                total_score,
            }
        });
        return NextResponse.json(updatedScore);
    } catch (error){
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

}

export async function DELETE(req: NextRequest, params: { userId: string, interviewId: string }){
    try{
        const score = await prisma.score.delete({
            where: {
                userId_interviewId: {
                    userId: parseInt(params.userId),
                    interviewId: parseInt(params.interviewId),
                }
            }
        });
        return NextResponse.json(score);
    } catch (error){
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

}