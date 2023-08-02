"use client"
import * as z from "zod"
import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "../ui/modal"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

const formSchema = z.object({
  name: z.string().min(1).max(50),
})

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/stores", values);
      window.location.assign(`/${response.data.id}`)
      toast.success("Store creation successful 🎉")
    } catch (error) {
      toast.error("Something went wrong 🤯")
    } finally {
      setLoading(false);
    }}

  return (
    <Modal title="Create a store" description="Create a new store to manage"
    isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
      <div>
        <div space-y-4 py-2 pb-4>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField control={form.control} name="name" render={({field}) => (
                <FormItem>
                  <FormLabel>
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Shop Name" {...field}/>
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}/>
              <div className="pt-6 space-x-2 flex items-center justify-end w-ful">
                  <Button className="text-rose-700 hover:text-white border
                  border-rose-700 hover:bg-rose-700 focus:ring-4 focus:outline-none
                  focus:ring-red-300 font-medium rounded-lg text-sm text-center dark:border-red-500
                  dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600
                  dark:focus:ring-red-900"
                  disabled={loading}
                  variant="outline"
                  onClick={storeModal.onClose}>
                    Cancel
                  </Button>
                  <Button className="relative items-center border-lime-400 border-2 hover:text-white
                  justify-center p-0 overflow-hidden text-sm font-medium
                  text-lime-500 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300
                  group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white"
                  disabled={loading}
                  type="submit"
                  variant="outline">
                  <span className="relative px-5 py-2.5 dark:hover-text-white transition-all ease-in duration-50 bg-white rounded-md group-hover:bg-opacity-0">
                    Create
                  </span>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
