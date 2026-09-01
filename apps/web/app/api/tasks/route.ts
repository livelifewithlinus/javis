import { NextResponse } from "next/server";
import { listTasks, createTask } from "@jarvis/db";
export async function GET(){return NextResponse.json(await listTasks());}
export async function POST(request:Request){const body=await request.json();if(typeof body.title!=="string"||!body.title.trim())return NextResponse.json({error:"Title is required"},{status:400});return NextResponse.json(await createTask(body.title));}
