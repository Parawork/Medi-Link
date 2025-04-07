"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PharmacyCard from "../../components/pharmacy/PharmacyCard";

export default function SearchPharmacyByName() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [searchField, setSearchField] = useState<"name" | "city" | "address">(
    (searchParams.get("field") as "name" | "city" | "address") || "name"
  );
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);

    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    params.set("field", searchField);
    router.push(`/site/patient/search-pharmacies?${params.toString()}`);

    try {
      const response = await fetch(`/api/pharmacy/search?${params.toString()}`);
      const data = await response.json();
      setPharmacies(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial search when component mounts
  useEffect(() => {
    if (searchParams.get("q")) {
      handleSearch();
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Find Pharmacies</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                type="text"
                placeholder={`Search by ${searchField}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value as any)}
                className="border rounded-md px-3 py-2"
              >
                <option value="name">Name</option>
                <option value="city">City</option>
                <option value="address">Address</option>
              </select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        {/* Search Results */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : pharmacies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacies.map((pharmacy) => (
              <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-8 text-gray-500">
            No pharmacies found matching your search
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Enter search terms to find pharmacies
          </div>
        )}
      </div>
    </div>
  );
}
