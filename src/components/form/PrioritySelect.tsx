import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import type { Priority } from "@/types";

type Props = {
  value: Priority;
  onChange: (priority: Priority) => void;
  size?: "sm" | "md";
};

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: "High", label: "High", color: "red" },
  { value: "Medium", label: "Medium", color: "orange" },
  { value: "Low", label: "Low", color: "blue" },
];

const PrioritySelect: React.FC<Props> = ({ value, onChange, size = "md" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPriority = priorities.find((p) => p.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (priority: Priority) => {
    onChange(priority);
    setIsOpen(false);
  };

  return (
    <Box position="relative" ref={dropdownRef}>
      <Box
        onClick={() => setIsOpen(!isOpen)}
        cursor="pointer"
        px={4}
        py={2.5}
        borderRadius="xl"
        border="2px solid"
        borderColor={isOpen ? "blue.400" : "gray.200"}
        bg="white"
        _hover={{ borderColor: isOpen ? "blue.400" : "gray.300" }}
        transition="all 0.2s"
      >
        <HStack justify="space-between">
          <HStack gap={2}>
            {selectedPriority && (
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={`${selectedPriority.color}.500`}
              />
            )}
            <Text fontSize={size === "sm" ? "sm" : "md"} fontWeight="500">
              {selectedPriority?.label || "Select priority"}
            </Text>
          </HStack>
          <Box
            as={FiChevronDown}
            fontSize="16px"
            color="gray.500"
            transform={isOpen ? "rotate(180deg)" : "rotate(0)"}
            transition="transform 0.2s"
          />
        </HStack>
      </Box>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left="0"
          right="0"
          bg="white"
          borderRadius="md"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
          py={1}
          zIndex={10}
        >
          {priorities.map((priority) => (
            <Box
              key={priority.value}
              px={4}
              py={2}
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
              onClick={() => handleSelect(priority.value)}
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
                {value === priority.value && (
                  <Box as={FiCheck} fontSize="14px" color="blue.500" />
                )}
              </HStack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PrioritySelect;
