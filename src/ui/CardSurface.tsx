import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

type Props = BoxProps & {
  isDragging?: boolean;
};

const CardSurface: React.FC<Props> = ({ children, isDragging, ...props }) => {
  return (
    <Box
      bg="bg.panel"
      border="1px solid"
      borderColor="border.muted"
      borderRadius="xl"
      boxShadow={isDragging ? "soft" : "0 10px 22px rgba(15, 23, 42, 0.08)"}
      transition="all 0.15s ease"
      {...props}
    >
      {children}
    </Box>
  );
};

export default CardSurface;
