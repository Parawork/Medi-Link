"use client";
import { cn } from "@/lib/utils";
import {
  BrainCircuit,
  Goal,
  HomeIcon,
  NotebookText,
  Receipt,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const dashboardLinks = [
  {
    id: 0,
    name: "Home",
    href: "/site/pharmacy",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Order History",
    href: "/site/pharmacy/order-history",
    icon: Users2,
  },
  {
    id: 2,
    name: "User Profile",
    href: "/site/pharmacy/updateProfile",
    icon: Receipt,
  },
];

export function DashboardLinks() {
  const pathname = usePathname();

  return (
    <>
      {dashboardLinks.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={cn(
            link.href === "/site/pharmacy"
              ? pathname === link.href
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
              : pathname.includes(link.href)
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground",
            "flex gap-3 items-center rounded-lg px-6 py-4 transition-all hover:text-primary"
          )}
        >
          <link.icon className="size-4" />
          {link.name}
        </Link>
      ))}
    </>
  );
}
