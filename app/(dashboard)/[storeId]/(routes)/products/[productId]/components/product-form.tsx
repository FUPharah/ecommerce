"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Category, Image, Product, Colour, Size } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


interface ProductFormProps {
  initialData: Product & {
    images: Image[];
  } | null;
  categories: Category[];
  colours: Colour[];
  sizes: Size[];
}

const formSchema = z.object({
  name: z.string().min(1).max(255),
  images: z.object({url: z.string()}).array().max(5),
  price: z.coerce.number().positive(),
  categoryId: z.string().min(1).max(255),
  colourId: z.string().min(1).max(255),
  sizeId: z.string().min(1).max(255),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  colours,
  sizes,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = initialData ? "Edit Product" : "New Product";
  const description = initialData ? "Edit your Product" : "Add a new Product";
  const toastMessage = initialData ? "Product updated successfully 🎉" : "Product added successfully 🎉";
  const action = initialData ? "Save Changes" : "Add a Product";
  const toastError = initialData ? "Something went wrong. 🤦‍♂️" : "Something went wrong. 🤦‍♂️";
  const toastCancel = initialData ? "❌ Product update canceled. ❌ " : "❌ Product creation canceled. ❌";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price)),
    } : {
      name: "",
      images: [],
      price: 0,
      categoryId: "",
      colourId: "",
      sizeId: "",
      isFeatured: false,
      isArchived: false,
    }
  });

  const onCancel = () => {
    toast.error(toastCancel);
    router.back();
  }

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.refresh()
      router.push(`/${params.storeId}/products`	)
      toast.success("Product deleted successfully 🎉");
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
        <FormField control={form.control} name="images" render={({ field }) => (
          <FormItem>
            <FormLabel>
              <span className="text-sm font-medium text-gray-700">Product Images</span>
            </FormLabel>
            <FormControl>
              <ImageUpload value={field.value.map((image) => image.url)}
              disabled={loading}
              onChange={(url) => field.onChange([...field.value, {url}])}
              onRemove={(url) =>
              field.onChange([...field.value.filter((current) => current.url!==url)])}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <div className="grid grid-cols-5 gap-8">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-sm font-medium text-gray-700">Name</span>
              </FormLabel>
              <FormControl className="border-2 hover:border-sky-500 border-black p-4 shadow-md shadow-black hover:shadow-sky-500">
                <Input disabled={loading} placeholder="Product Name" {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-sm font-medium text-gray-700">Price</span>
              </FormLabel>
              <FormControl className="border-2 hover:border-sky-500 border-black p-4 shadow-md shadow-black hover:shadow-sky-500">
                <Input type="number" disabled={loading} placeholder="123.99" {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-2 hover:border-sky-500 border-black p-4 shadow-md shadow-black hover:shadow-sky-500" >
                        <SelectValue defaultValue={field.value} placeholder="Select a Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent >
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}
                        {category.id == field.value && (
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
            name="sizeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-2 hover:border-sky-500 border-black p-4 shadow-md shadow-black hover:shadow-sky-500" >
                        <SelectValue defaultValue={field.value} placeholder="Select a Size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent >
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>{size.value}
                        {size.id == field.value && (
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
            name="colourId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colour</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-2 hover:border-sky-500 border-black p-4 shadow-md shadow-black hover:shadow-sky-500" >
                        <SelectValue defaultValue={field.value} placeholder="Select a Colour" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent >
                      {colours.map((colour) => (
                        <SelectItem key={colour.id} value={colour.id}>{colour.name}
                        {colour.id == field.value && (
                        <span className="text-sm text-gray-400 ml-1"> (Current)</span>
                      )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                <FormMessage />
              </FormItem>
            )}/>
          <FormField control={form.control} name="isFeatured" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-md border-2 p-3
            shadow-md shadow-black hover:shadow-sky-500 border-black hover:border-sky-500">
              <FormControl className="border-2 border-black hover:border-sky-500">
                <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
              </FormControl>
              <div className="space-y-2 leading-none">
                <FormLabel>
                  <span className="text-lg font-bold hover:text-sky-500 text-gray-700">Featured</span>
                </FormLabel>
                  <FormDescription>
                    <span className="text-md border-black  hover:text-sky-500 text-gray-500">Show this product on the home page.</span>
                  </FormDescription>
              </div>
            </FormItem>
          )}/>
          <FormField control={form.control} name="isArchived" render={({ field }) => (
            <FormItem className="flex flex-row
            items-start space-x-4 space-y-0 rounded-md border-2
            hover:border-sky-500 border-black p-3 shadow-md shadow-black hover:shadow-sky-500">
              <FormControl className="border-2 border-black hover:border-sky-500">
                <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
              </FormControl >
              <div className="space-y-2 leading-none">
                <FormLabel>
                  <span className="text-lg font-bold hover:text-sky-500 text-gray-700">Archive</span>
                </FormLabel>
                  <FormDescription>
                    <span className="text-md hover:text-sky-500 text-gray-500">Hide this product from the store.</span>
                  </FormDescription>
              </div>
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
          type="submit">
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
