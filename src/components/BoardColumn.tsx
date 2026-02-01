import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import type { Card, Column, Status } from "@/types";
import BoardCard from "@/components/BoardCard";
import ColumnHeader from "@/components/column/ColumnHeader";
import EmptyColumn from "@/components/column/EmptyColumn";

type Props = {
  column: Column;
  cards: Card[];
  count: number;
  dragOver: Status | null;
  onDragOver: (event: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onDragLeave: () => void;
  onEdit: (card: Card) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, status: Status) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
};

const BoardColumn: React.FC<Props> = ({
  column,
  cards,
  count,
  dragOver,
  onDragOver,
  onDrop,
  onDragLeave,
  onEdit,
  onRemove,
  onMove,
  onDragStart,
}) => {
  return (
    <Box
      bg="gray.50"
      border="1px solid"
      borderColor={dragOver === column.id ? "blue.300" : "gray.200"}
      borderRadius="2xl"
      p={4}
      minH="560px"
      onDragOver={(event) => onDragOver(event, column.id)}
      onDrop={(event) => onDrop(event, column.id)}
      onDragLeave={onDragLeave}
    >
      <ColumnHeader column={column} count={count} />

      <Stack gap={3}>
        {cards.map((card) => (
          <BoardCard
            key={card.id}
            card={card}
            onEdit={onEdit}
            onRemove={onRemove}
            onMove={onMove}
            onDragStart={onDragStart}
          />
        ))}
        {cards.length === 0 && <EmptyColumn />}
      </Stack>
    </Box>
  );
};

export default BoardColumn;
