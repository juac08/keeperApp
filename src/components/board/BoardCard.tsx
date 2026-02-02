import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import type { Card, Status } from "@/types";
import { CardActions, CardHeader, CardMeta } from "@/components/board/card";
import { useDensityStore } from "@/state/DensityStore";

const priorityColors = {
  High: "red.500",
  Medium: "orange.400",
  Low: "blue.400",
};

type Props = {
  card: Card;
  onCardClick: (card: Card) => void;
  onEdit: (card: Card) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, status: Status) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
  onArchive?: (id: string) => void;
};

const BoardCard: React.FC<Props> = ({
  card,
  onCardClick,
  onEdit,
  onRemove,
  onMove,
  onDragStart,
  onArchive,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { density } = useDensityStore();

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStart(event, card.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Density-based padding
  const paddingMap = {
    compact: 2,
    comfortable: 3,
    spacious: 4,
  };

  const padding = paddingMap[density];

  return (
    <Box
      role="group"
      draggable
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={handleDragEnd}
      bg="bg.panel"
      border="1px solid"
      borderColor="border.muted"
      borderLeft="3px solid"
      borderLeftColor={priorityColors[card.priority]}
      borderRadius="md"
      p={padding}
      boxShadow={isDragging ? "xl" : "sm"}
      onClick={() => !isDragging && onCardClick(card)}
      cursor={isDragging ? "grabbing" : "pointer"}
      opacity={isDragging ? 0.9 : 1}
      position="relative"
      transform={isDragging ? "rotate(2deg)" : "translateY(0)"}
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: isDragging ? "rotate(2deg)" : "translateY(-4px)",
        boxShadow: isDragging ? "xl" : "lg",
        borderColor: "gray.300",
      }}
    >
      <CardHeader
        card={card}
        onEdit={onEdit}
        onRemove={onRemove}
        onArchive={onArchive}
      />
      <CardMeta card={card} density={density} />
      <CardActions
        status={card.status}
        onMove={(status: Status) => onMove(card.id, status)}
        onArchive={() => onArchive?.(card.id)}
      />
    </Box>
  );
};

export default BoardCard;
