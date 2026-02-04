import React from "react";
import { Box, Grid, HStack } from "@chakra-ui/react";
import { FiRotateCcw } from "react-icons/fi";
import { FilterButtons, SearchBar, StatTiles } from "@/components/toolbar";
import { SortSelect } from "@/components/toolbar/SortSelect";
import type { SortOption } from "@/components/toolbar/SortSelect";
import { AppButton } from "@/ui";
import type { Priority } from "@/types";
import type { FilterType } from "@/hooks/useCardFilters";

type Props = {
  total: number;
  todo: number;
  inprogress: number;
  done: number;
  searchQuery: string;
  activeFilter: FilterType;
  priorityFilter: Priority | null;
  sortBy: SortOption;
  hasActiveFilters: boolean;
  onSearch: (query: string) => void;
  onFilterChange: (filter: FilterType) => void;
  onPriorityChange: (priority: Priority) => void;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
};

const BoardToolbar: React.FC<Props> = ({
  total,
  todo,
  inprogress,
  done,
  searchQuery,
  activeFilter,
  priorityFilter,
  sortBy,
  hasActiveFilters,
  onSearch,
  onFilterChange,
  onPriorityChange,
  onSortChange,
  onClearFilters,
}) => {
  return (
    <Box mb={8}>
      <Grid
        templateColumns={{ base: "1fr", lg: "1.4fr auto" }}
        gap={4}
        alignItems="center"
      >
        <SearchBar value={searchQuery} onChange={onSearch} />
        <HStack gap={3}>
          <SortSelect value={sortBy} onChange={onSortChange} />
          <FilterButtons
            activeFilter={activeFilter}
            priorityFilter={priorityFilter}
            onFilterChange={onFilterChange}
            onPriorityChange={onPriorityChange}
          />
          {hasActiveFilters && (
            <AppButton
              size="sm"
              h="40px"
              px={4}
              variantStyle="ghost"
              icon={<FiRotateCcw />}
              onClick={onClearFilters}
              color="text.secondary"
              _hover={{ color: "text.primary", bg: "bg.muted" }}
            >
              Clear
            </AppButton>
          )}
        </HStack>
      </Grid>
      <StatTiles
        total={total}
        todo={todo}
        inprogress={inprogress}
        done={done}
      />
    </Box>
  );
};

export default BoardToolbar;
