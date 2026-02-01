import { useMemo, useState } from "react";
import type { Card, Priority } from "@/types";

export type FilterType = "all" | "priority" | "blocked";

export type FilterState = {
  searchQuery: string;
  activeFilter: FilterType;
  priorityFilter: Priority | null;
};

export const useCardFilters = (cards: Card[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);

  const filteredCards = useMemo(() => {
    let result = [...cards];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (card) =>
          card.title.toLowerCase().includes(query) ||
          card.content.toLowerCase().includes(query) ||
          card.blockedReason.toLowerCase().includes(query),
      );
    }

    // Apply blocked filter
    if (activeFilter === "blocked") {
      result = result.filter((card) => card.blocked);
    }

    // Apply priority filter
    if (activeFilter === "priority" && priorityFilter) {
      result = result.filter((card) => card.priority === priorityFilter);
    }

    return result;
  }, [cards, searchQuery, activeFilter, priorityFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: FilterType) => {
    if (activeFilter === filter) {
      setActiveFilter("all");
      setPriorityFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  const handlePriorityChange = (priority: Priority) => {
    setPriorityFilter(priority);
    setActiveFilter("priority");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setPriorityFilter(null);
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 || activeFilter !== "all";

  return {
    filteredCards,
    searchQuery,
    activeFilter,
    priorityFilter,
    hasActiveFilters,
    handleSearch,
    handleFilterChange,
    handlePriorityChange,
    clearFilters,
  };
};
