import prisma from "@/lib/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const createdQuestions = await prisma.interviewquestion.createMany({
            data: data.questions,
        });
        return NextResponse.json(createdQuestions);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create questions" }, { status: 500 });
    }
}

