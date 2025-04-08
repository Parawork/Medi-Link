import { ReactNode } from "react";

import { redirect } from "next/navigation";
import Link from "next/link";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User2 } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import { signOut } from "@/lib/auth";

import { cn } from "@/lib/utils";
import { handleSignOut } from "../components/patient/signOutAction";
import { PharmacyDashboardLinks } from "../components/PharmacyDashboardLinks";
import { PatientDashboardLinks } from "../components/PatientDashboardLinks";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <>
      {/* LEFT SIDE */}
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r md:block sticky top-0 h-screen">
          {/* LOGO AND NAME */}
          <div className="flex max-h-screen h-full gap-2 flex-col ">
            <div className="flex w-full items-center border-b px-4 md:h-14 lg:h-[60px] lg:px-6 bg-primary">
              <Link href="/" className="mx-auto text-2xl font-bold text-white">
                Medi-Link
                {/* LOGO */}
              </Link>
            </div>
            <div className="flex-1 ">
              <nav className="px-3 mt-3">
                <PatientDashboardLinks />
                <div className="w-full hover:bg-red-100 rounded-lg">
                  <form action={handleSignOut}>
                    <button type="submit">
                      <div className="flex gap-3 items-center rounded-lg px-6 py-4 transition-all text-red-500 w-full">
                        <LogOut className="size-5" /> <span>Logout</span>
                      </div>
                    </button>
                  </form>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex flex-col">
          {/* NAVBAR == HEADER */}
          <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6 sticky top-0 bg-primary z-50">
            {/* ONLY FOR MOBILE */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden">
                  <Menu className="size-8 text-white" />
                </button>
              </SheetTrigger>
              <SheetContent side="left">
                <DialogTitle> </DialogTitle>
                <nav className="grid gap-2 mt-10 mx-auto">
                  <PatientDashboardLinks />
                  <div className="w-full hover:bg-red-100 rounded-lg">
                    <form action={handleSignOut}>
                      <button type="submit">
                        <div className="flex gap-3 items-center rounded-lg px-6 py-4 transition-all text-red-500 w-full">
                          <LogOut className="size-5" /> <span>Logout</span>
                        </div>
                      </button>
                    </form>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* LARGER SCREENS */}
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
