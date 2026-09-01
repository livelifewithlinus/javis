import { NextResponse } from "next/server";
import { getActivity } from "@jarvis/db";
export async function GET() { return NextResponse.json(await getActivity()); }
