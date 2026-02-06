import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const Panel: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      bg="bg.panel"
      borderRadius={{ base: "2xl", md: "3xl" }}
      border="2px solid"
      borderColor="border.muted"
      boxShadow="soft"
      px={{ base: 5, md: 8 }}
      py={{ base: 6, md: 8 }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Panel;
