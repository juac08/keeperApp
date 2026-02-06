import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const TagPill: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      px={2.5}
      py={1}
      borderRadius="full"
      border="1px solid"
      borderColor="border.muted"
      bg="bg.muted"
      fontSize="xs"
      fontWeight="600"
      {...props}
    >
      {children}
    </Box>
  );
};

export default TagPill;
