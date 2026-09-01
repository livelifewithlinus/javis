import { NextResponse } from "next/server";
import { listMemories, createMemory } from "@jarvis/memory";
export async function GET(){return NextResponse.json(await listMemories());}
export async function POST(request:Request){const body=await request.json();if(typeof body.content!=="string"||!body.content.trim())return NextResponse.json({error:"Content is required"},{status:400});return NextResponse.json(await createMemory(body.content));}
