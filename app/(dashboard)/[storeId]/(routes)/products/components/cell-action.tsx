"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProductColumn } from "./columns"
import { Button } from "@/components/ui/button";
import { CopyCheck, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: ProductColumn;
};

export const CellAction: React.FC<CellActionProps> = ({
  data
}) => {
  const router= useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopy = (id: string,) => {
    navigator.clipboard.writeText(data.name);
    toast.success("Name Copied to clipboard successfully");
  };

  const onPriceCopy = (price: string,) => {
    navigator.clipboard.writeText(data.price);
    toast.success("Price Copied to clipboard successfully");
  };

  const onCategoryCopy = (category: string,) => {
    navigator.clipboard.writeText(data.category);
    toast.success("Category Copied to clipboard successfully");
  };

  const onSizeCopy = (size: string,) => {
    navigator.clipboard.writeText(data.size);
    toast.success("Size Copied to clipboard successfully");
  };

  const onColourCopy = (colour: string,) => {
    navigator.clipboard.writeText(data.colour);
    toast.success("Colour Copied to clipboard successfully");
  };

  const onDateCopy = (createdAt: string,) => {
    navigator.clipboard.writeText(data.createdAt);
    toast.success("Date Copied to clipboard successfully");
  };

  const onIdCopy = (id: string,) => {
    navigator.clipboard.writeText(data.id);
    toast.success("Id Copied to clipboard successfully");
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/products/${data.id}`)
      router.refresh()
      toast.success("Product deleted successfully 🎉");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
    <AlertModal isOpen={open} onClose={() => setOpen(false)}
      onConfirm={onDelete} loading={loading} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only"> Open Menu </span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onIdCopy(data.id)}>
            <CopyCheck className="mr-2 h-4 w-4"/>
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <CopyCheck className="mr-2 h-4 w-4"/>
            Copy Name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPriceCopy(data.price)}>
            <CopyCheck className="mr-2 h-4 w-4"/>
            Copy Price
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCategoryCopy(data.category)}>
            <CopyCheck className="mr-2 h-4 w-4"/>
            Copy Category
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSizeCopy(data.size)}>
            <CopyCheck className="mr-2 h-4 w-4"/>
            Copy Size
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onColourCopy(data.colour)}>
            <CopyCheck className="mr-2 h-4 w-4"/>
            Copy Colour
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateCopy(data.createdAt)}>
            <CopyCheck className="mr-2 h-4 w-4"/>
            Copy Date
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4"/>
            Update / Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4"/>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
