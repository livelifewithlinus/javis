import { NextRequest } from "next/server";
import { runAgent } from "@jarvis/agent";
export async function POST(request:NextRequest){try{const body=await request.json();const message=typeof body.message==="string"?body.message:"";if(!message.trim())return Response.json({error:"Message is required"},{status:400});return Response.json(await runAgent({message,userId:body.userId,workspaceId:body.workspaceId}));}catch(error){console.error(error);return Response.json({error:"Unable to process request"},{status:500});}}
