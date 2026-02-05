import React from "react";
import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { FiColumns } from "react-icons/fi";

const ProjectInfo: React.FC = () => {
  return (
    <HStack gap={4} align="center">
      <Box
        w="52px"
        h="52px"
        borderRadius="16px"
        bg="linear-gradient(140deg, #1d4ed8 0%, #38bdf8 100%)"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 12px 24px rgba(29, 78, 216, 0.22)"
        flexShrink={0}
        border="1px solid"
        borderColor="whiteAlpha.700"
      >
        <Box as={FiColumns} fontSize="22px" />
      </Box>
      <Box>
        <Heading
          size="lg"
          fontWeight="800"
          color="text.primary"
          letterSpacing="-0.02em"
        >
          Product Board
        </Heading>
        <Text color="text.muted" fontSize="sm" fontWeight="500">
          Workspace overview
        </Text>
      </Box>
    </HStack>
  );
};

export default ProjectInfo;
