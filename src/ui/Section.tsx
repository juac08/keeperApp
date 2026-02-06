import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const Section: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      bg="bg.panel"
      border="1px solid"
      borderColor="border.muted"
      borderRadius="2xl"
      boxShadow="0 18px 40px rgba(15, 23, 42, 0.08)"
      {...props}
    >
      {children}
    </Box>
  );
};

export default Section;
