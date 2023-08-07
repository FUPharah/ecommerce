"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColourColumn } from "./columns"
import { Button } from "@/components/ui/button";
import { CopyCheck, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: ColourColumn;
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

  const onCopyValue = (id: string,) => {
    navigator.clipboard.writeText(data.value);
    toast.success("Value Copied to clipboard successfully");
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
      await axios.delete(`/api/${params.storeId}/colours/${data.id}`)
      router.refresh()
      toast.success("colour deleted successfully 🎉");
    } catch (error) {
      toast.error("Make sure you removed all products using this billboard first. ❗❕");
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
          <DropdownMenuItem onClick={() => onCopyValue(data.id)}>
            <CopyCheck className="mr-2 h-4 w-4"/>
            Copy Value
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDateCopy(data.createdAt)}>
            <CopyCheck className="mr-2 h-4 w-4"/>
            Copy Date
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/colours/${data.id}`)}>
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
