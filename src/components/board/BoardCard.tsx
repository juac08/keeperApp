import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import type { Card } from "@/types";
import { CardHeader, CardMeta } from "@/components/board/card";
import { useDensityStore } from "@/state/DensityStore";

type Props = {
  card: Card;
  onCardClick: (card: Card) => void;
  onEdit: (card: Card) => void;
  onRemove: (id: string) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
  onArchive?: (id: string) => void;
};

const BoardCard: React.FC<Props> = ({
  card,
  onCardClick,
  onEdit,
  onRemove,
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
      data-group
      draggable
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={handleDragEnd}
      bg="bg.panel"
      border="1px solid"
      borderColor="border.muted"
      borderRadius="xl"
      p={padding}
      boxShadow={isDragging ? "soft" : "0 10px 22px rgba(15, 23, 42, 0.08)"}
      onClick={() => !isDragging && onCardClick(card)}
      cursor={isDragging ? "grabbing" : "pointer"}
      opacity={isDragging ? 0.9 : 1}
      position="relative"
      transform={isDragging ? "rotate(2deg)" : "translateY(0)"}
      transition="all 0.15s ease"
      _hover={{
        transform: isDragging ? "rotate(2deg)" : "translateY(-2px)",
        boxShadow: isDragging ? "soft" : "0 18px 36px rgba(15, 23, 42, 0.16)",
        borderColor: "blue.200",
      }}
    >
      <CardHeader
        card={card}
        onEdit={onEdit}
        onRemove={onRemove}
        onArchive={onArchive}
      />
      <CardMeta card={card} density={density} />
    </Box>
  );
};

export default React.memo(BoardCard);
