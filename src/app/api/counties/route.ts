import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const counties = await prisma.countyAuction.findMany();
  return NextResponse.json(counties);
}