import prismadb from '@/lib/prismadb';

export const getTotalOrders = async (storeId: string) => {
  const totalOrders = await prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return totalOrders;
};
