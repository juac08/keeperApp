import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const ToolbarSurface: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      bg="bg.panel"
      borderBottom="1px solid"
      borderColor="border.muted"
      boxShadow="0 1px 2px rgba(0, 0, 0, 0.03)"
      {...props}
    >
      {children}
    </Box>
  );
};

export default ToolbarSurface;
