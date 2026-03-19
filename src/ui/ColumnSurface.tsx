import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

type Props = BoxProps & {
  isActive?: boolean;
};

const ColumnSurface: React.FC<Props> = ({ children, isActive, ...props }) => {
  return (
    <Box
      bg={isActive ? "blue.500/10" : "bg.muted"}
      border="1px solid"
      borderColor={isActive ? "blue.400/30" : "border.subtle"}
      borderRadius="card"
      p={4}
      minH="560px"
      transition="all 0.2s ease"
      boxShadow="none"
      {...props}
    >
      {children}
    </Box>
  );
};

export default ColumnSurface;
