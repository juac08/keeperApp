import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const ToolbarSurface: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      bg="bg.panel"
      borderBottom="1px solid"
      borderColor="border.muted"
      boxShadow="0 8px 20px rgba(15, 23, 42, 0.06)"
      {...props}
    >
      {children}
    </Box>
  );
};

export default ToolbarSurface;
