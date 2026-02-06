import React from "react";
import { Box, Grid, HStack, Stack, Text } from "@chakra-ui/react";
import { FiRotateCcw } from "react-icons/fi";
import { FilterButtons, SearchBar, StatTiles } from "@/components/toolbar";
import { SortSelect } from "@/components/toolbar/SortSelect";
import type { SortOption } from "@/components/toolbar/SortSelect";
import { AppButton, Pill } from "@/ui";
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
  const chips: string[] = [];
  if (searchQuery.trim()) {
    chips.push(`Search: ${searchQuery.trim()}`);
  }
  if (activeFilter === "blocked") {
    chips.push("Blocked");
  }
  if (activeFilter === "priority" && priorityFilter) {
    chips.push(`Priority: ${priorityFilter}`);
  }

  return (
    <Box mb={8}>
      <Stack
        gap={3}
        position="sticky"
        top={0}
        zIndex={2}
        pt={2}
        pb={3}
        bg="bg.panel"
        borderBottom="1px solid"
        borderColor="border.muted"
        boxShadow="0 8px 20px rgba(15, 23, 42, 0.06)"
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "1.4fr auto" }}
          gap={4}
          alignItems="center"
        >
          <SearchBar value={searchQuery} onChange={onSearch} />
          <HStack gap={3} flexWrap="wrap" justify="flex-end">
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
        {chips.length > 0 && (
          <HStack gap={2} flexWrap="wrap">
            {chips.map((chip) => (
              <Pill key={chip}>
                <Text fontSize="xs" color="text.secondary">
                  {chip}
                </Text>
              </Pill>
            ))}
          </HStack>
        )}
      </Stack>
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
