import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function PATCH (
  req: Request,
  { params }: { params: {storeId: string, productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, price, categoryId, sizeId, colourId, images, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
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

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colourId,
        images: { deleteMany: {} },
        isFeatured,
        isArchived,
      }
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: {url:string}) => image)]}}},
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE (
  req: Request,
  { params }: { params: { storeId: string, productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);

  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export async function GET (
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        colour: true,
      }
    });

    return NextResponse.json(product);

  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
