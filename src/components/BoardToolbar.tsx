import React from "react";
import { Box, Grid, HStack, Text } from "@chakra-ui/react";
import { FiRotateCcw } from "react-icons/fi";
import FilterButtons from "@/components/toolbar/FilterButtons";
import SearchBar from "@/components/toolbar/SearchBar";
import StatTiles from "@/components/toolbar/StatTiles";
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
  hasActiveFilters: boolean;
  onSearch: (query: string) => void;
  onFilterChange: (filter: FilterType) => void;
  onPriorityChange: (priority: Priority) => void;
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
  hasActiveFilters,
  onSearch,
  onFilterChange,
  onPriorityChange,
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
              color="gray.600"
              _hover={{ color: "gray.800", bg: "gray.100" }}
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
