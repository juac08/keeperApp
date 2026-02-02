import React from "react";
import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { FiColumns } from "react-icons/fi";

const ProjectInfo: React.FC = () => {
  return (
    <HStack gap={4} align="center">
      <Box
        w="52px"
        h="52px"
        borderRadius="18px"
        bg="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="lg"
        flexShrink={0}
      >
        <Box as={FiColumns} fontSize="24px" />
      </Box>
      <Box>
        <Heading size="lg">Product Board</Heading>
        <Text color="text.muted">
          Track work, move cards, and ship updates with clarity.
        </Text>
      </Box>
    </HStack>
  );
};

export default ProjectInfo;
