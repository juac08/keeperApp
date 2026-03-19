import React from "react";
import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { FiColumns } from "react-icons/fi";

const ProjectInfo: React.FC = () => {
  return (
    <HStack gap={3} align="center">
      <Box
        w="40px"
        h="40px"
        borderRadius="12px"
        bg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 2px 8px rgba(59, 130, 246, 0.25)"
        flexShrink={0}
      >
        <Box as={FiColumns} fontSize="18px" />
      </Box>
      <Box>
        <Heading
          size="md"
          fontWeight="700"
          color="text.primary"
          letterSpacing="-0.02em"
        >
          Product Board
        </Heading>
        <Text color="text.muted" fontSize="xs" fontWeight="500">
          Workspace overview
        </Text>
      </Box>
    </HStack>
  );
};

export default ProjectInfo;
