// components/PaginationControls.tsx
"use client";

import Link from "next/link";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  basePath: string;
}

export default function PaginationControls({
  totalItems,
  itemsPerPage,
  currentPage,
  basePath,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        href={{
          pathname: basePath,
          query: {
            page: currentPage > 1 ? currentPage - 1 : 1,
            per_page: itemsPerPage,
          },
        }}
      >
        <Button variant="outline" size="sm" disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </Link>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <Link
              key={pageNum}
              href={{
                pathname: basePath,
                query: {
                  page: pageNum,
                  per_page: itemsPerPage,
                },
              }}
            >
              <Button
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
              >
                {pageNum}
              </Button>
            </Link>
          );
        })}
      </div>

      <Link
        href={{
          pathname: basePath,
          query: {
            page: currentPage < totalPages ? currentPage + 1 : totalPages,
            per_page: itemsPerPage,
          },
        }}
      >
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
