"use client"
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Store } from "@prisma/client";
import { Trash2 } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Modal } from "../ui/modal";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}
export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted){
    return null
  }

  return (
    <Modal title="Are you sure? 🤔"
    description="This Action cannot be undone 🙅‍♂️"
    isOpen={isOpen}
    onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center
        justify-end w-full">
        <Button disabled={loading}
          variant="outline"
          onClick={onClose}
          >
          Cancel
        </Button>
        <Button disabled={loading}
          variant="destructive"
          onClick={onConfirm}
          className="text-black font-bold bg-gradient-to-r
          from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4
          focus:outline-none focus:ring-red-300 dark:focus:ring-red-800
          shadow-lg shadow-red-500/50 dark:shadow-lg
          dark:shadow-red-800/80"
          >
          Delete
        </Button>
      </div>
    </Modal>
  )
};
