import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const Section: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      bg="bg.panel"
      border="1px solid"
      borderColor="border.muted"
      borderRadius="xl"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.04)"
      {...props}
    >
      {children}
    </Box>
  );
};

export default Section;
