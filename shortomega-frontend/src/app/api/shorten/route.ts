import { axiosPost } from "@/utils/axiosUtils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const SERVER_URL = process.env.SERVER_URL;

export async function POST(request: NextRequest) {
  const data = await request.json();
  const res = await axiosPost(SERVER_URL + "/shorten", data);
  if ("error" in res) {
    return NextResponse.error();
  }
  return NextResponse.json({ data: res.data });
}
