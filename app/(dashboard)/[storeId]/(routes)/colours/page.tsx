import prismadb from "@/lib/prismadb";
import { ColourClient } from "./components/client"
import { ColourColumn } from "./components/columns";
import { format } from "date-fns";

const ColoursPage = async ({
  params
}: {
  params: { storeId: string };
}) => {
  const colours = await prismadb.colour.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedColours: ColourColumn[] = colours.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "dd MMM yyyy HH:mm")
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColourClient data={formattedColours}/>
      </div>
    </div>
  );
}

export default ColoursPage;
