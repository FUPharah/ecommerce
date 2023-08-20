import { Heading } from "@/components/ui/heading";
import prismadb from "@/lib/prismadb";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Package, Package2, PackageCheck, PackageOpen, PackagePlus, PlusCircle, PlusSquare } from "lucide-react";
import { formatter } from "@/lib/utils";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getTotalOrders } from "@/actions/get-total-orders";
import { getProductsInStock } from "@/actions/get-products-in-stock";
import { Overview } from "@/components/overview";
import { getGraphRevenue } from "@/actions/get-graph-revenue";

interface DashboardPageProps {
  params: { storeId: string }
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
  params
}) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const totalOrders = await getTotalOrders(params.storeId);
  const productsInStock = await getProductsInStock(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);

  return (
  <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading title="Dashboard" description="Welcome to your dashboard" />
      <Separator />
      <div className="grid gap-4 grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-10 h-10 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatter.format(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Total Orders
            </CardTitle>
            <CreditCard className="w-10 h-10 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span>
                +{totalOrders}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Products in Stock
            </CardTitle>
            <PackageCheck className="w-10 h-10 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span>
                {productsInStock}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview data={graphRevenue} />
        </CardContent>
      </Card>
    </div>
  </div>
  );
}

export default DashboardPage;
