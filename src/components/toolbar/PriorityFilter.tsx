import React from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";
import type { Priority } from "@/types";

type Props = {
  selected: Priority | null;
  onSelect: (priority: Priority) => void;
};

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: "High", label: "High", color: "red" },
  { value: "Medium", label: "Medium", color: "orange" },
  { value: "Low", label: "Low", color: "blue" },
];

const PriorityFilter: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <Box
      position="absolute"
      top="calc(100% + 8px)"
      right="0"
      bg="bg.panel"
      borderRadius="lg"
      boxShadow="lg"
      border="1px solid"
      borderColor="border.muted"
      py={2}
      minW="160px"
      zIndex={10}
    >
      {priorities.map((priority) => (
        <Box
          key={priority.value}
          px={4}
          py={2}
          cursor="pointer"
          _hover={{ bg: "gray.50" }}
          onClick={() => onSelect(priority.value)}
        >
          <HStack justify="space-between">
            <HStack gap={2}>
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={`${priority.color}.500`}
              />
              <Text fontSize="sm" fontWeight="500">
                {priority.label}
              </Text>
            </HStack>
            {selected === priority.value && (
              <Box as={FiCheck} fontSize="14px" color="blue.500" />
            )}
          </HStack>
        </Box>
      ))}
    </Box>
  );
};

export default PriorityFilter;
