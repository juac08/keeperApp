import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import type { Card, Status } from "@/types";
import { CardActions, CardHeader, CardMeta } from "@/components/board/card";

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
};

const BoardCard: React.FC<Props> = ({
  card,
  onCardClick,
  onEdit,
  onRemove,
  onMove,
  onDragStart,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStart(event, card.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Box
      role="group"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderLeft="3px solid"
      borderLeftColor={priorityColors[card.priority]}
      borderRadius="md"
      p={3}
      boxShadow="sm"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onCardClick(card)}
      cursor={isDragging ? "grabbing" : "pointer"}
      opacity={isDragging ? 0.5 : 1}
      position="relative"
      transform="translateY(0)"
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "lg",
        borderColor: "gray.300",
      }}
    >
      <CardHeader card={card} onEdit={onEdit} onRemove={onRemove} />
      <CardMeta card={card} />
      <CardActions
        status={card.status}
        onMove={(status) => onMove(card.id, status)}
      />
    </Box>
  );
};

export default BoardCard;
