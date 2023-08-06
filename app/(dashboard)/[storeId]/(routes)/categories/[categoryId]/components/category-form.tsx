"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { Billboard, Category } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2),
  billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
};

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const title = initialData ? "Update this category" : "New Category";
  const description = initialData ? "Edit this category" : "Create a new category";
  const toastMessage = initialData ? "Category updated successfully 🎉" : "Category created successfully 🎉" ;
  const action = initialData ? "Save Changes" : "Create a new Category";
  const toastError = initialData ? "Something went wrong. 🤦‍♂️" : "Make sure you removed all products using this category first. ❗❕";
  const toastCancel = initialData ? "❌ Category update canceled. ❌ " : "❌ Category creation canceled. ❌";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: '',
    }
  });

  const onCancel = () => {
    toast.error(toastCancel);
    router.back();
  }

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
    } catch (error: any) {
      toast.error(toastError);
    } finally {
      setLoading(false);
    }
    if (initialData) {
      await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
    } else {
      await axios.post(`/api/${params.storeId}/categories`, data);
    }
    router.refresh();
    router.push(`/${params.storeId}/categories`);
    toast.success(toastMessage);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success('Category deleted.');
    } catch (error: any) {
      toast.error(toastError);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
    <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            className="bg-gradient-to-r border-2 border-red-300 hover:border-red-900
          from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4
            focus:outline-none focus:ring-red-300 dark:focus:ring-red-800
            shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80"
            disabled={loading} variant="destructive" type="button" size="icon" onClick={() => setOpen(true)}>
          <Trash2 className="h-4 w-4 hover:text-black"/>
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl className="border-2 border-black hover:border-sky-500">
                    <Input disabled={loading} placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-2 border-black hover:border-sky-500" >
                          <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent >
                        {billboards.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}
                            {billboard.id !== field.value && (
                            <Image alt="preview" src={billboard.imageUrl} width={50} height={50} className="rounded-lg" />
                            )}
                          {billboard.id == field.value && (
                          <span className="text-sm text-gray-400 ml-1"> (Current)</span>
                        )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
                )}/>
                <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preview</FormLabel>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                          <SelectValue defaultValue={field.value} />
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            <Image
                            alt="selected-preview"
                            src={billboards.find((b) => b.id === form.getValues("billboardId"))?.imageUrl ?? ""}
                            width={250}
                            height={250}
                            className="w-[450px] h-[350px] border-4 border-rose-600 shadow-lg shadow-rose-500 hover:border-sky-500 rounded-lg"/>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
                )}/>
          </div>
          <div className="flex items-center w-full">
        <div>
          <Button disabled={loading} className="text-white bg-gradient-to-r
          from-lime-400 via-lime-500 to-lime-600 hover:bg-gradient-to-br
          focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800
          rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 border-green-500 border-2
          border-opacity-50 hover:border-lime-800 focus:border-lime-200
          shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 flex items-center justify-center"
          type="submit"
        >
          <span className="font-bold hover:text-black">{action}</span>
        </Button>
        </div>
        <div className="flex-grow">
          <Button
            disabled={loading}
            className="text-white bg-gradient-to-r
            from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br
            focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800
            rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 border-rose-500 border-2
            border-opacity-50 hover:border-rose-800 focus:border-rose-200
            shadow-lg shadow-rose-500/50 dark:shadow-lg dark:shadow-rose-800/80 flex items-center justify-center"
            onClick={onCancel} type="button"
            >
            <span className="font-bold hover:text-black">Cancel</span>
          </Button>
          </div>
          </div>
        </form>
      </Form>
    </>
  );
};
