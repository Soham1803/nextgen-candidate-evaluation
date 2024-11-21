import prisma from "@/lib/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string; interviewId: string } }
) {
    try {
        const userInterview = await prisma.userInterview.findUnique({
            where: {
                userId_interviewId: {
                    userId: parseInt(params.userId),
                    interviewId: parseInt(params.interviewId)
                }
            },
            include: {
                user: true,
                interview: true,
                score: true
            }
        });

        if (!userInterview) {
            return NextResponse.json(
                { error: 'User interview not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(userInterview);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { userId: string; interviewId: string } }
) {
    const { videoLink } = await req.json();

    if (!videoLink) {
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        );
    }

    try {
        const userInterview = await prisma.userInterview.update({
            where: {
                userId_interviewId: {
                    userId: parseInt(params.userId),
                    interviewId: parseInt(params.interviewId)
                }
            },
            data: {
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: { userId: string; interviewId: string } }
) {
    try {
        await prisma.userInterview.delete({
            where: {
                userId_interviewId: {
                    userId: parseInt(params.userId),
                    interviewId: parseInt(params.interviewId)
                }
            }
        });

        return NextResponse.json({ message: 'User interview deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
