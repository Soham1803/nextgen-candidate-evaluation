import prisma from "@/lib/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, params: { id: string }){
    try{
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(params.id),
            }
        });
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error){
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

}

export async function PUT(req: NextRequest, params: { id: string }){
    try{
        const { name, email, age, userinterviews } = await req.json();

        if(!name || !email || !age){
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: {
                id: parseInt(params.id),
            },
            data: {
                name,
                email,
                age,
                userinterviews,
            }
        });
        return NextResponse.json(user);
    } catch (error){
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, params: { id: string }){
    try{
        const user = await prisma.user.delete({
            where: {
                id: parseInt(params.id),
            }
        });
        return NextResponse.json(user);
    } catch (error){
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}