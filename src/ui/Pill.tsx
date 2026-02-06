import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const Pill: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      px={3}
      py={1}
      borderRadius="full"
      border="1px solid"
      borderColor="border.muted"
      bg="bg.muted"
      {...props}
    >
      {children}
    </Box>
  );
};

export default Pill;
