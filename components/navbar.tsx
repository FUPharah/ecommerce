import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ModeToggle } from "./ui/mode-toggle";

const Navbar = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  })
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores}/>
        <MainNav className="mx-6"/>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle/>
          <div className="border-2 rounded-full border-rose-600">
          <UserButton afterSignOutUrl="/"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
