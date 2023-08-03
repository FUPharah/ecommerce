"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Billboard } from "@prisma/client";
import { Trash2 } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";


interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1).max(255),
  imageUrl: z.string().url().min(1).max(255),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = initialData ? "Edit Billboard" : "New Billboard";
  const description = initialData ? "Edit your billboard" : "Create a new billboard";
  const toastMessage = initialData ? "Billboard updated successfully 🎉" : "Billboard created successfully 🎉";
  const action = initialData ? "Save Changes" : "Create Billboard";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    }
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Store updated successfully 🎉");
    } catch (error) {
      toast.error("Something went wrong 🤷‍♂️");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push("/")
      toast.success("Store deleted successfully 🎉");
    } catch (error) {
      toast.error("🚫 All Products and Catagories needs to be deleted first. 🚫");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
  <>
    <AlertModal
    isOpen={open}
    onClose={() => setOpen(false)}
    onConfirm={onDelete}
    loading={loading}
    />
    <div className="flex items-center justify-between">
      <Heading title= {title} description= {description} />
      {initialData && (
      <Button disabled={loading} variant="destructive" className="bg-gradient-to-r
        from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4
        focus:outline-none focus:ring-red-300 dark:focus:ring-red-800
        shadow-lg shadow-red-500/50 dark:shadow-lg
        dark:shadow-red-800/80"
        size="icon"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 "/>
      </Button>
      )}
    </div>
    <Separator/>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField control={form.control} name="imageUrl" render={({ field }) => (
          <FormItem>
            <FormLabel>
              <span className="text-sm font-medium text-gray-700">Background Image</span>
            </FormLabel>
            <FormControl>
              <ImageUpload value={field.value ? [field.value] : []}
              disabled={loading}
              onChange={(url) => field.onChange(url )}
              onRemove={() => field.onChange("")}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <div className="grid grid-cols-3 gap-8">
          <FormField control={form.control} name="label" render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-sm font-medium text-gray-700">Label</span>
              </FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Billboard Label" {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
        </div>
        <Button disabled={loading} className="text-white bg-gradient-to-r
          from-lime-400 via-lime-500 to-lime-600 hover:bg-gradient-to-br
          focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800
          rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 border-green-500 border-2
          border-opacity-50 hover:border-lime-800 focus:border-lime-200
          shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80"
          type="submit"
        >
          <span className="font-bold">{action}</span>
        </Button>
      </form>
    </Form>
    <Separator/>
  </>
  )
};
