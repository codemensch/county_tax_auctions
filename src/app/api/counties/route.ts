import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Pagination
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const skip = (page - 1) * limit;

  // Fetch paginated data
  const counties = await prisma.countyAuction.findMany({
    skip,
    take: limit,
  });

  // Total count for pagination
  const totalCount = await prisma.countyAuction.count();

  return NextResponse.json({
    data: counties,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
}