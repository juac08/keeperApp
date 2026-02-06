import React from "react";
import { Box, HStack, Skeleton, SkeletonText } from "@chakra-ui/react";

const SkeletonCard: React.FC = () => {
  return (
    <Box
      bg="bg.panel"
      borderRadius="xl"
      border="1px solid"
      borderColor="border.muted"
      p={3}
    >
      <Skeleton h="14px" w="65%" mb={2} />
      <SkeletonText noOfLines={2} />
      <HStack mt={3} justify="space-between">
        <Skeleton h="10px" w="80px" />
        <Skeleton h="20px" w="20px" borderRadius="full" />
      </HStack>
    </Box>
  );
};

export default SkeletonCard;
