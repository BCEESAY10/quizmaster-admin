"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, User, UserCog, HelpCircle, Tag } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { searchAPI } from "@/src/lib/api";
import { SearchResult, SearchAPIResponse } from "@/src/types";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { useDebounceSearch } from "@/src/hooks/useDebounceSearch";

export function SearchBar() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isManuallyDismissed, setIsManuallyDismissed] = useState(false);

  const searchFn = useCallback(async (query: string) => {
    try {
      // Ensure query is trimmed and not empty
      const trimmedQuery = query.trim();
      if (!trimmedQuery || trimmedQuery.length < 2) {
        return {
          users: [],
          admins: [],
          questions: [],
          categories: [],
        } as SearchResult;
      }

      const response = await searchAPI.search(trimmedQuery);
      const apiData = response.data as SearchAPIResponse;

      // Transform the API response to match our SearchResult interface
      return {
        users: (apiData.results.users ?? []).map((user) => ({
          id: user.id,
          fullName: user.name,
          email: user.email,
          role: user.role,
        })),
        admins: (apiData.results.admins ?? []).map((admin) => ({
          id: admin.id,
          fullName: admin.name,
          email: admin.email,
          role: admin.role,
        })),
        questions: apiData.results.questions ?? [],
        categories: apiData.results.categories ?? [],
      } as SearchResult;
    } catch (error) {
      console.error("Search error details:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      // Return empty results instead of throwing
      return {
        users: [],
        admins: [],
        questions: [],
        categories: [],
      } as SearchResult;
    }
  }, []);

  const { query, setQuery, results, isLoading } =
    useDebounceSearch<SearchResult>({
      searchFn,
      delay: 500,
      minQueryLength: 2, // Minimum 2 characters to avoid too many results
    });

  // Derive isOpen - show dropdown if not manually dismissed and there's a query
  const isOpen =
    !isManuallyDismissed && query.length > 0 && (isLoading || results !== null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsManuallyDismissed(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setIsManuallyDismissed(false); // Reset dismissal when user types
  };

  const handleResultClick = (type: string, id: string) => {
    setQuery("");

    switch (type) {
      case "user":
        router.push(`/users/${id}`);
        break;
      case "admin":
        router.push(`/admins/${id}`);
        break;
      case "question":
        router.push(`/questions/${id}`);
        break;
      case "category":
        router.push(`/categories`);
        break;
    }
  };

  const hasResults =
    results &&
    ((results.users?.length ?? 0) > 0 ||
      (results.admins?.length ?? 0) > 0 ||
      (results.questions?.length ?? 0) > 0 ||
      (results.categories?.length ?? 0) > 0);

  return (
    <div ref={searchRef} className="relative w-80">
      <Input
        placeholder="Search users, admins, questions..."
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        leftIcon={<Search className="h-5 w-5 text-gray-400" />}
      />

      {isOpen && query && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="sm" />
            </div>
          ) : hasResults ? (
            <div className="py-2">
              {/* Users */}
              {(results.users?.length ?? 0) > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Users
                  </div>
                  {results.users?.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleResultClick("user", user.id)}
                      className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 text-left">
                      <User className="h-4 w-4 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Admins */}
              {(results.admins?.length ?? 0) > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Admins
                  </div>
                  {results.admins?.map((admin) => (
                    <button
                      key={admin.id}
                      onClick={() => handleResultClick("admin", admin.id)}
                      className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 text-left">
                      <UserCog className="h-4 w-4 text-purple-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {admin.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {admin.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Questions */}
              {(results.questions?.length ?? 0) > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Questions
                  </div>
                  {results.questions?.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleResultClick("question", question.id)}
                      className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 text-left">
                      <HelpCircle className="h-4 w-4 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {question.question}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {question.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Categories */}
              {(results.categories?.length ?? 0) > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Categories
                  </div>
                  {results.categories?.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleResultClick("category", category.id)}
                      className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 text-left">
                      <Tag className="h-4 w-4 text-orange-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {category.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-sm text-gray-500">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
