"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { ProductColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface ProductClientProps {
  data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({
  data

}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Products(${data.length})`}
        description="Manage your products." />
        <Button className="text-white bg-gradient-to-r from-cyan-500 to-blue-500
        hover:bg-gradient-to-bl focus:ring-4 focus:outline-none border-2
        border-blue-500 border-opacity-50 hover:shadow-cyan-800
        hover:border-cyan-800 focus:border-cyan-200
        focus:ring-cyan-300 dark:focus:ring-cyan-800 font-extrabold
        rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 shadow-lg
        shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80"
        onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="font-extrabold mr-2 h-5 w-5" />
          Add a Product
        </Button>
      </div>
      <Separator/>
      <DataTable searchKey="name" columns={columns} data={data}/>
      <Heading title="API" description="API for Products." />
      <Separator/>
      <ApiList entityName="products" entityIdName="productId"/>
    </>
  )
};
