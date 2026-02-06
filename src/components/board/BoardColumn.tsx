import React from "react";
import { Stack } from "@chakra-ui/react";
import type { Card, Column, Status } from "@/types";
import BoardCard from "./BoardCard";
import { ColumnHeader, EmptyColumn } from "@/components/board/column";
import { ColumnSurface } from "@/ui";

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
  onCreate?: () => void;
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
  onCreate,
}) => {
  return (
    <ColumnSurface
      isActive={dragOver === column.id}
      onDragOver={(event) => onDragOver(event, column.id)}
      onDrop={(event) => onDrop(event, column.id)}
      onDragLeave={onDragLeave}
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
        {cards.length === 0 && (
          <EmptyColumn
            title={`No ${column.title.toLowerCase()} tasks yet`}
            description="Drag cards here or create a new one"
            onCreate={onCreate}
          />
        )}
      </Stack>
    </ColumnSurface>
  );
};

export default React.memo(BoardColumn);
