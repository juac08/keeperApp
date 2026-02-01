import React from "react";
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

const BoardCard: React.FC<Props> = ({ card, onEdit, onRemove, onMove, onDragStart }) => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={4}
      boxShadow="sm"
      draggable
      onDragStart={(event) => onDragStart(event, card.id)}
    >
      <CardHeader card={card} onEdit={onEdit} onRemove={onRemove} />
      <CardMeta card={card} />
      <CardActions status={card.status} onMove={(status) => onMove(card.id, status)} />
    </Box>
  );
};

export default BoardCard;
