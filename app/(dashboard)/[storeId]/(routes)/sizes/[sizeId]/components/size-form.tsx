"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Size } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface SizeFormProps {
  initialData: Size | null;
}

const formSchema = z.object({
  name: z.string().min(1).max(255),
  value: z.string().min(1).max(255),
});

const sizes = [
  { name: "Extra Small", value: "XS" },
  { name: "Small", value: "S" },
  { name: "Medium", value: "M" },
  { name: "Large", value: "L" },
  { name: "Extra Large", value: "XL" },
  { name: "2X Large", value: "XXL" },
  { name: "3X Large", value: "XXXL" },
]

type SizeFormValues = z.infer<typeof formSchema>;

export const SizeForm: React.FC<SizeFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = initialData ? "Edit Size" : "New Size";
  const description = initialData ? "Edit your Size" : "Create a new Size";
  const toastMessage = initialData ? "Size updated successfully 🎉" : "Size created successfully 🎉";
  const action = initialData ? "Save Changes" : "Create Size";
  const toastError = initialData ? "Something went wrong. 🤦‍♂️" : "Make sure you removed all products using this Size first. ❗❕";
  const toastCancel = initialData ? "❌ Size update canceled. ❌ " : "❌ Size creation canceled. ❌";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    }
  });

  const onCancel = () => {
    toast.error(toastCancel);
    router.back();
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      setLoading(true);

      const formData = form.getValues(); // Get the form data from the react-hook-form
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, formData);
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, formData);
      }

      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error(toastError);
    } finally {
      setLoading(false);
    }
  };


  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
      router.refresh()
      router.push(`/${params.storeId}/sizes`	)
      toast.success("Size deleted successfully 🎉");
    } catch (error) {
      toast.error(toastError);
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
      <form onSubmit={onSubmit} className="space-y-8 w-full">
        <div className="md:grid md:grid-cols-4 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl className="border-2 border-black hover:border-sky-500">
                  <Input disabled={loading} placeholder="Size Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="value" render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-sm font-medium text-gray-700">Value</span>
              </FormLabel>
            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="border-2 border-black hover:border-sky-500" >
                  <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                </SelectTrigger>
              </FormControl>
              <SelectContent >
                {sizes.map((size) => (
                  <SelectItem key={size.value} value={size.name}>{size.value}
                    {size.name === field.value && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Current)</span>
                    )}
                    {size.value == field.value && (
                      <span className="text-sm text-gray-400 ml-1"> (Current)</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          <FormMessage />
        </FormItem>
        )}/>
          </div>
        <div className="flex items-center justify-between">
        <div>
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
            onClick={onCancel} type="button">
            <span className="font-bold hover:text-black">Cancel</span>
          </Button>
          </div>
        </div>
      </form>
    </Form>
  </>
  )
};
