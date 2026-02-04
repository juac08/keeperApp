import React from "react";
import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { FiColumns } from "react-icons/fi";

const ProjectInfo: React.FC = () => {
  return (
    <HStack gap={3} align="center">
      <Box
        w="48px"
        h="48px"
        borderRadius="14px"
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 4px 12px rgba(102, 126, 234, 0.3)"
        flexShrink={0}
        transition="all 0.2s"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
        }}
      >
        <Box as={FiColumns} fontSize="22px" />
      </Box>
      <Box>
        <Heading
          size="lg"
          fontWeight="700"
          color="text.primary"
          letterSpacing="-0.02em"
        >
          Product Board
        </Heading>
        <Text color="text.muted" fontSize="sm" fontWeight="500">
          Track work, move cards, and ship updates with clarity.
        </Text>
      </Box>
    </HStack>
  );
};

export default ProjectInfo;
