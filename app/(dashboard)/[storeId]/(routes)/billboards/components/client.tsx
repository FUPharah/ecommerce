"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

export const BillboardClient = () => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Billboards (0)"
        description="Billboards are the main way to display your content." />
        <Button className="text-white bg-gradient-to-r from-cyan-500 to-blue-500
        hover:bg-gradient-to-bl focus:ring-4 focus:outline-none border-2
        border-blue-500 border-opacity-50
        hover:border-cyan-800 focus:border-cyan-200
        focus:ring-cyan-300 dark:focus:ring-cyan-800 font-extrabold
        rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 shadow-lg
        shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80"
        onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="font-extrabold mr-2 h-5 w-5" />
          Create Billboard
        </Button>
      </div>
      <Separator/>
    </>
  )
}
