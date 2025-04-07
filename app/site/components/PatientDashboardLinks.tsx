"use client";
import { cn } from "@/lib/utils";
import { Clock8, HomeIcon, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const patientDashboardLinks = [
  {
    id: 0,
    name: "Home",
    href: "/site/patient",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Locate Pharmacies",
    href: "/site/patient/locate-pharmacies",
    icon: Search,
  },
  {
    id: 2,
    name: "Order History",
    href: "/site/patient/order-history",
    icon: Clock8,
  },
  {
    id: 3,
    name: "User Profile",
    href: "/site/patient/updateProfile",
    icon: User,
  },
];

export function PatientDashboardLinks() {
  const pathname = usePathname();

  return (
    <>
      {patientDashboardLinks.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={cn(
            link.href === "/site/patient"
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
