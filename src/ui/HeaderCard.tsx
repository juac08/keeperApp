import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

const HeaderCard: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      px={{ base: 5, md: 7 }}
      py={{ base: 4, md: 5 }}
      bg="bg.panel"
      borderRadius="2xl"
      border="1px solid"
      borderColor="border.muted"
      boxShadow="0 18px 40px rgba(15, 23, 42, 0.08)"
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
