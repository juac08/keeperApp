import React from "react";
import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { FiColumns } from "react-icons/fi";

const ProjectInfo: React.FC = () => {
  return (
    <HStack gap={3} align="center">
      <Box
        w="44px"
        h="44px"
        borderRadius="12px"
        bg="bg.muted"
        color="text.primary"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        border="1px solid"
        borderColor="border.muted"
      >
        <Box as={FiColumns} fontSize="20px" />
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
