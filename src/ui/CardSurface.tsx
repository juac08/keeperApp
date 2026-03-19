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
      borderRadius="card"
      boxShadow={
        isDragging
          ? "soft"
          : "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)"
      }
      transition="all 0.15s ease"
      {...props}
    >
      {children}
    </Box>
  );
};

export default CardSurface;
