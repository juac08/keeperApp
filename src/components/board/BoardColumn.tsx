import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import type { Card, Column, Status } from "@/types";
import BoardCard from "./BoardCard";
import { ColumnHeader, EmptyColumn } from "@/components/board/column";

type Props = {
  column: Column;
  cards: Card[];
  count: number;
  dragOver: Status | null;
  onDragOver: (event: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onDragLeave: () => void;
  onCardClick: (card: Card) => void;
  onEdit: (card: Card) => void;
  onRemove: (id: string) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
  onArchive: (id: string) => void;
};

const BoardColumn: React.FC<Props> = ({
  column,
  cards,
  count,
  dragOver,
  onDragOver,
  onDrop,
  onDragLeave,
  onCardClick,
  onEdit,
  onRemove,
  onDragStart,
  onArchive,
}) => {
  return (
    <Box
      bg={dragOver === column.id ? "blue.50" : "gray.50"}
      border="1px solid"
      borderColor={dragOver === column.id ? "blue.400" : "gray.200"}
      borderRadius="2xl"
      p={4}
      minH="560px"
      onDragOver={(event) => onDragOver(event, column.id)}
      onDrop={(event) => onDrop(event, column.id)}
      onDragLeave={onDragLeave}
      transition="all 0.2s ease"
      boxShadow={dragOver === column.id ? "lg" : "none"}
      transform={dragOver === column.id ? "scale(1.02)" : "scale(1)"}
    >
      <ColumnHeader column={column} count={count} />

      <Stack gap={3} minH="400px">
        {cards.map((card) => (
          <BoardCard
            key={card.id}
            card={card}
            onCardClick={onCardClick}
            onEdit={onEdit}
            onRemove={onRemove}
            onDragStart={onDragStart}
            onArchive={onArchive}
          />
        ))}
        {cards.length === 0 && <EmptyColumn />}
      </Stack>
    </Box>
  );
};

export default BoardColumn;
