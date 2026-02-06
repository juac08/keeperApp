import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const ContentContainer: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      maxW="1600px"
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 8 }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ContentContainer;
