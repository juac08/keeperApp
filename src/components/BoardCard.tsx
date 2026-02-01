import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import type { Card, Status } from "@/types";
import CardActions from "@/components/card/CardActions";
import CardHeader from "@/components/card/CardHeader";
import CardMeta from "@/components/card/CardMeta";

type Props = {
  card: Card;
  onEdit: (card: Card) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, status: Status) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
};

const BoardCard: React.FC<Props> = ({
  card,
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
      bg="white"
      border="1px solid"
      borderColor={card.blocked ? "purple.300" : "gray.200"}
      borderRadius="xl"
      p={4}
      boxShadow="sm"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      cursor={isDragging ? "grabbing" : "grab"}
      opacity={isDragging ? 0.5 : 1}
      transform={isDragging ? "rotate(2deg)" : "none"}
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        boxShadow: "md",
        transform: "translateY(-2px)",
        borderColor: card.blocked ? "purple.400" : "gray.300",
      }}
      position="relative"
    >
      {card.blocked && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          h="3px"
          bg="linear-gradient(90deg, purple.400 0%, purple.500 100%)"
          borderTopRadius="xl"
        />
      )}
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
