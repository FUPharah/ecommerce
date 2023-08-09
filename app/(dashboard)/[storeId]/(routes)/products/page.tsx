import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({
  params
}: {
  params: { storeId: string };
}) => {
  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
    include: { category: true, size: true, colour: true }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category.name,
    size: item.size.name,
    colour: item.colour.name,
    price: formatter.format(item.price.toNumber()),
    isFeatured: item.isFeatured,
    isArchived: item.isArcedhiv,
    createdAt: format(item.createdAt, "dd MMM yyyy HH:mm")
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts}/>
      </div>
    </div>
  );
}

export default ProductsPage;
