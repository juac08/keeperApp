import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "priority"
  | "assignee"
  | "title";

type Props = {
  value: SortOption;
  onChange: (sort: SortOption) => void;
};

const options: { value: SortOption; label: string }[] = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "priority", label: "By Priority" },
  { value: "assignee", label: "By Assignee" },
  { value: "title", label: "By Title (A-Z)" },
];

export const SortSelect: React.FC<Props> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "Sort";

  const handleSelect = (sortValue: SortOption) => {
    onChange(sortValue);
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
        border="1px solid"
        borderColor={isOpen ? "blue.400" : "border.muted"}
        boxShadow={
          isOpen
            ? "0 0 0 2px rgba(59, 130, 246, 0.15)"
            : "0 8px 18px rgba(15, 23, 42, 0.04)"
        }
        bg="bg.panel"
        minW="180px"
        transition="all 0.2s"
        _hover={{ borderColor: isOpen ? "blue.400" : "border.muted" }}
      >
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="500" color="text.primary">
            {selectedLabel}
          </Text>
          <FiChevronDown
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s",
            }}
          />
        </HStack>
      </Box>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left="0"
          right="0"
          bg="bg.panel"
          border="1px solid"
          borderColor="border.muted"
          borderRadius="lg"
          boxShadow="lg"
          zIndex={10}
          overflow="hidden"
        >
          {options.map((option) => (
            <Box
              key={option.value}
              px={4}
              py={2.5}
              cursor="pointer"
              bg={value === option.value ? "blue.50" : "bg.panel"}
              color={value === option.value ? "blue.600" : "text.primary"}
              fontWeight={value === option.value ? "600" : "400"}
              fontSize="sm"
              transition="all 0.15s"
              _hover={{
                bg: value === option.value ? "blue.50" : "bg.muted",
              }}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
