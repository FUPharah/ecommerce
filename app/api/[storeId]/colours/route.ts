import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Colour Name is Required", { status: 400 })
    }

    if (!value) {
      return new NextResponse("Colour Value is Required", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is Required", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    const colour = await prismadb.colour.create({
      data: {
        name,
        value,
        storeId: params.storeId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    return NextResponse.json(colour);
  } catch (error) {
    console.log('[COLOURS_POST]', error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is Required", { status: 400 })
    }

    const colour = await prismadb.colour.findMany({
      where: {
        storeId: params.storeId
      },
    });

    return NextResponse.json(colour);
  } catch (error) {
    console.log('[COLOURS_GET]', error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
