import React from "react";
import { Badge, Box, Heading, HStack, Text } from "@chakra-ui/react";
import { FiColumns } from "react-icons/fi";

const ProjectInfo: React.FC = () => {
  return (
    <HStack gap={4} align="center">
      <Box
        w="52px"
        h="52px"
        borderRadius="18px"
        bgGradient="linear(to-br, blue.600, blue.400)"
        color="white"
        display="grid"
        placeItems="center"
        boxShadow="lg"
      >
        <FiColumns />
      </Box>
      <Box>
        <Text
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="0.24em"
          color="gray.500"
          fontWeight="700"
        >
          Project
        </Text>
        <Heading size="lg">Product Board</Heading>
        <Text color="gray.500">
          Track work, move cards, and ship updates with clarity.
        </Text>
        <HStack mt={3} gap={2}>
          <Badge colorScheme="blue" variant="subtle">
            Active sprint
          </Badge>
          <Badge colorScheme="green" variant="subtle">
            3 teammates
          </Badge>
        </HStack>
      </Box>
    </HStack>
  );
};

export default ProjectInfo;
