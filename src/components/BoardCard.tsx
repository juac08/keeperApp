import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import type { Card, Status } from "@/types";
import CardActions from "@/components/card/CardActions";
import CardHeader from "@/components/card/CardHeader";
import CardMeta from "@/components/card/CardMeta";

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
      borderRadius="md"
      p={3}
      boxShadow="sm"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onCardClick(card)}
      cursor={isDragging ? "grabbing" : "pointer"}
      opacity={isDragging ? 0.5 : 1}
      transform={isDragging ? "rotate(2deg)" : "none"}
      transition="all 0.2s ease"
      _hover={{
        bg: "gray.50",
        boxShadow: "md",
        borderColor: "gray.300",
      }}
      position="relative"
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
