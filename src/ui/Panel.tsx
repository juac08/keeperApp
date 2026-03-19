import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const Panel: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      bg="bg.panel"
      borderRadius={{ base: "xl", md: "2xl" }}
      border="1px solid"
      borderColor="border.muted"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.04)"
      px={{ base: 5, md: 7 }}
      py={{ base: 5, md: 7 }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Panel;
