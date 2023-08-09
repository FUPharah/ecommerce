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
    const { name, price, categoryId, sizeId, colourId, images, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse("Image URL is Required", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is Required", { status: 400 })
    }

    if (!categoryId) {
      return new NextResponse("Category ID is Required", { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse("Size ID is Required", { status: 400 })
    }

    if (!colourId) {
      return new NextResponse("Colour ID is Required", { status: 400 })
    }

    if (!price) {
      return new NextResponse("Price is Required", { status: 400 })
    }

    if (isFeatured === undefined) {
      return new NextResponse("isFeatured is Required", { status: 400 })
    }

    if (isArchived === undefined) {
      return new NextResponse("isArchived is Required", { status: 400 })
    }

    if (typeof isFeatured !== "boolean") {
      return new NextResponse("isFeatured must be a boolean", { status: 400 })
    }

    if (typeof isArchived !== "boolean") {
      return new NextResponse("isArchived must be a boolean", { status: 400 })
    }

    if (typeof price !== "number") {
      return new NextResponse("Price must be a number", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colourId,
        images: {createMany: {data: [...images.map((image: {url:string}) => image)]}},
        isFeatured,
        isArchived,
        storeId: params.storeId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colourId = searchParams.get("colourId") || undefined;
    const isFeatured = searchParams.get("isFeatured");


    if (!params.storeId) {
      return new NextResponse("Store ID is Required", { status: 400 })
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colourId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        size: true,
        colour: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
