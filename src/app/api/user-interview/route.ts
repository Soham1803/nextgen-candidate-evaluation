import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaDb";



export async function POST(req: NextRequest) {

    try {
        const { userId, interviewId, createdAt, videoLink } = await req.json();

        if (!userId || !interviewId || !createdAt || !videoLink) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Save the interview data to the database
        const userInterview = await prisma.userInterview.create({
            data: {
                userId,
                interviewId,
                createdAt,
                videoLink
            }
        });

        return NextResponse.json(userInterview);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}