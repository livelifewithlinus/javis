import { NextRequest, NextResponse } from "next/server";
import { decideApproval } from "@jarvis/db";
export async function POST(_request: NextRequest,{params}:{params:Promise<{id:string;decision:string}>}) { const {id,decision}=await params; if(decision!=="approve"&&decision!=="deny") return NextResponse.json({error:"Invalid decision"},{status:400}); return NextResponse.json(await decideApproval(id,decision)); }
