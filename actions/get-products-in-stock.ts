import prismadb from '@/lib/prismadb';

export const getProductsInStock = async (storeId: string) => {
  const ProductsInStock = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false
    },
  });

  return ProductsInStock;
};
