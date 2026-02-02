import { useMemo, useState } from "react";
import type { Card, Priority } from "@/types";
import type { SortOption } from "@/components/toolbar/SortSelect";

export type FilterType = "all" | "priority" | "blocked";

export type FilterState = {
  searchQuery: string;
  activeFilter: FilterType;
  priorityFilter: Priority | null;
  sortBy: SortOption;
};

export const useCardFilters = (cards: Card[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

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

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "priority":
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "assignee":
          const aAssignee = a.assigneeId || "";
          const bAssignee = b.assigneeId || "";
          return aAssignee.localeCompare(bAssignee);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [cards, searchQuery, activeFilter, priorityFilter, sortBy]);

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

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
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
    sortBy,
    hasActiveFilters,
    handleSearch,
    handleFilterChange,
    handlePriorityChange,
    handleSortChange,
    clearFilters,
  };
};
