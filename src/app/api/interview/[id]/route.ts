import prisma from "@/lib/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, params: { id: string }) {
    try {
        const userInterview = await prisma.interview.findUnique({
            where: {
                id: parseInt(params.id)
            },
            include: {  
                questions: true,
                userInterviews: {
                    include: {
                        user: true
                    }
                }
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

export async function DELETE(req: NextRequest, params: { id: string }) {
    try {
        await prisma.interview.delete({
            where: {
                id: parseInt(params.id)
            }
        });
        return NextResponse.json({ message: 'Interview deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}