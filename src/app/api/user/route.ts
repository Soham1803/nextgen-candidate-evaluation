import prisma from "@/lib/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        const { name, email, age } = await req.json();

        if(!name || !email || !age){
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                age,
            }
        });
        return NextResponse.json(user);
    } catch (error){
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}