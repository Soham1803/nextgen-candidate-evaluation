import prisma from "@/lib/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const { title, topic, difficulty, nquestions } = await req.json();

        if (!title || !topic || !difficulty || !nquestions) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Save the interview data to the database
        const interview = await prisma.interview.create({
            data: {
                title,
                topic,
                difficulty,
                nquestions,
                date: new Date()
            }
        });

        return NextResponse.json(interview);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}