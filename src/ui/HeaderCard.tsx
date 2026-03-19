import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const HeaderCard: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      px={{ base: 4, md: 6 }}
      py={{ base: 3, md: 4 }}
      bg="bg.panel"
      borderRadius="xl"
      border="1px solid"
      borderColor="border.muted"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)"
      {...props}
    >
      <HStack
        align="center"
        justify="space-between"
        gap={{ base: 4, md: 6 }}
        flexWrap="wrap"
      >
        {children}
      </HStack>
    </Box>
  );
};

export default HeaderCard;
