import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { rut, legalName } = await req.json();

  const entity = await prisma.entity.create({
    data: { rut, legalName },
  });

  return NextResponse.json({ entity });
}