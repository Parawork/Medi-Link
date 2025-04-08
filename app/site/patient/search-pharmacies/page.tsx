"use client";

import { useState, useEffect, useRef } from "react";
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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setShowSuggestions(false);

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

  // Fetch suggestions as user types
  const fetchSuggestions = async (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set("q", term);
      params.set("field", searchField);
      params.set("limit", "5"); // Limit suggestions to 5 items

      const response = await fetch(`/api/pharmacy/search?${params.toString()}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Suggestion error:", error);
    }
  };

  // Handle input change with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchField]);

  // Initial search when component mounts
  useEffect(() => {
    if (searchParams.get("q")) {
      handleSearch();
    }
  }, []);

  const handleSuggestionClick = (pharmacy: any) => {
    setSearchTerm(pharmacy[searchField]);
    setShowSuggestions(false);
    setPharmacies([pharmacy]); // Show just the selected pharmacy
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Find Pharmacies</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2 relative" ref={searchRef}>
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder={`Search by ${searchField}...`}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="flex-1"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    {suggestions.map((pharmacy) => (
                      <div
                        key={pharmacy.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(pharmacy)}
                      >
                        {pharmacy[searchField]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
