import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

type Props = BoxProps & {
  isActive?: boolean;
};

const ColumnSurface: React.FC<Props> = ({ children, isActive, ...props }) => {
  return (
    <Box
      bg={isActive ? "blue.50" : "bg.panel"}
      border="1px solid"
      borderColor={isActive ? "blue.300" : "border.muted"}
      _dark={{
        bg: isActive ? "blue.900" : "bg.panel",
        borderColor: isActive ? "blue.700" : "border.muted",
      }}
      borderRadius="card"
      p={4}
      minH="560px"
      transition="all 0.2s ease"
      boxShadow={
        isActive ? "soft" : "0 10px 26px rgba(15, 23, 42, 0.06)"
      }
      transform={isActive ? "scale(1.02)" : "scale(1)"}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ColumnSurface;
