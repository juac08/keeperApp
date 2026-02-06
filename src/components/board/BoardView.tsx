import React from "react";
import { Box, Grid, HStack, SimpleGrid, Skeleton, VStack } from "@chakra-ui/react";
import type { Card, Status } from "@/types";
import { COLUMNS } from "@/config";
import { BoardHeader, BoardToolbar, BoardColumn } from "@/components/board";
import type { FilterType } from "@/hooks/useCardFilters";
import type { Priority } from "@/types";
import type { SortOption } from "@/components/toolbar/SortSelect";
import { SkeletonCard } from "@/ui";

type Props = {
  cards: Card[];
  cardsLoading: boolean;
  counts: Record<Status, number>;
  searchQuery: string;
  activeFilter: FilterType;
  priorityFilter: Priority | null;
  sortBy: SortOption;
  hasActiveFilters: boolean;
  dragOver: Status | null;
  cardsByStatus: Record<Status, Card[]>;
  onSearch: (query: string) => void;
  onFilterChange: (filter: FilterType) => void;
  onPriorityChange: (priority: Priority) => void;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onDragLeave: () => void;
  onCardClick: (card: Card) => void;
  onEdit: (card: Card) => void;
  onRemove: (id: string) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
  onArchive: (id: string) => void;
  onCreate: (status: Status) => void;
  onCreateBoard: () => void;
  onOpenArchive: () => void;
  onOpenExportImport: () => void;
  onOpenTemplates: () => void;
  onOpenMembers: () => void;
  onOpenOrganizationMembers: () => void;
  onDeleteBoard: () => void;
};

const BoardView: React.FC<Props> = ({
  cards,
  cardsLoading,
  counts,
  searchQuery,
  activeFilter,
  priorityFilter,
  sortBy,
  hasActiveFilters,
  dragOver,
  cardsByStatus,
  onSearch,
  onFilterChange,
  onPriorityChange,
  onSortChange,
  onClearFilters,
  onDragOver,
  onDrop,
  onDragLeave,
  onCardClick,
  onEdit,
  onRemove,
  onDragStart,
  onArchive,
  onCreate,
  onCreateBoard,
  onOpenArchive,
  onOpenExportImport,
  onOpenTemplates,
  onOpenMembers,
  onOpenOrganizationMembers,
  onDeleteBoard,
}) => {
  return (
    <>
      <BoardHeader
        onCreateBoard={onCreateBoard}
        onOpenArchive={onOpenArchive}
        onOpenExportImport={onOpenExportImport}
        onOpenTemplates={onOpenTemplates}
        onOpenMembers={onOpenMembers}
        onOpenOrganizationMembers={onOpenOrganizationMembers}
        onDeleteBoard={onDeleteBoard}
      />
      {cardsLoading ? (
        <Box mb={8}>
          <Grid
            templateColumns={{ base: "1fr", lg: "1.4fr auto" }}
            gap={4}
            alignItems="center"
            mb={4}
          >
            <Skeleton h="44px" borderRadius="lg" />
            <HStack gap={3} justify="flex-end">
              <Skeleton h="44px" w="150px" borderRadius="lg" />
              <Skeleton h="44px" w="130px" borderRadius="lg" />
              <Skeleton h="44px" w="100px" borderRadius="lg" />
            </HStack>
          </Grid>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
            {[0, 1, 2, 3].map((tile) => (
              <Box
                key={tile}
                bg="bg.muted"
                borderRadius="xl"
                p={3}
                border="1px solid"
                borderColor="border.muted"
              >
                <Skeleton h="10px" w="60%" mb={2} />
                <Skeleton h="20px" w="40%" />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      ) : (
        <BoardToolbar
          total={cards.length}
          todo={counts.todo}
          inprogress={counts.inprogress}
          done={counts.done}
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          priorityFilter={priorityFilter}
          sortBy={sortBy}
          hasActiveFilters={hasActiveFilters}
          onSearch={onSearch}
          onFilterChange={onFilterChange}
          onPriorityChange={onPriorityChange}
          onSortChange={onSortChange}
          onClearFilters={onClearFilters}
        />
      )}
      {cardsLoading ? (
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={4}>
          {COLUMNS.map((column) => (
            <Box
              key={column.id}
              bg="bg.muted"
              border="2px solid"
              borderColor="border.muted"
              borderRadius="2xl"
              p={4}
              minH="560px"
            >
              <HStack justify="space-between" mb={4}>
                <HStack gap={2}>
                  <Skeleton w="10px" h="10px" borderRadius="full" />
                  <Skeleton h="14px" w="120px" />
                </HStack>
                <Skeleton h="18px" w="28px" borderRadius="full" />
              </HStack>
              <Skeleton h="12px" w="75%" mb={4} />
              <VStack gap={3} align="stretch" minH="400px">
                {[0, 1, 2, 3].map((card) => (
                  <SkeletonCard key={card} />
                ))}
              </VStack>
            </Box>
          ))}
        </Grid>
      ) : (
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={4}>
          {COLUMNS.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              cards={cardsByStatus[column.id]}
              count={counts[column.id]}
              dragOver={dragOver}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragLeave={onDragLeave}
              onCardClick={onCardClick}
              onEdit={onEdit}
              onRemove={onRemove}
              onDragStart={onDragStart}
              onArchive={onArchive}
              onCreate={() => onCreate(column.id)}
            />
          ))}
        </Grid>
      )}
    </>
  );
};

export default BoardView;
