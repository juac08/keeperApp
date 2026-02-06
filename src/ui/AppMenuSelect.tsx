import React, { useEffect, useRef, useState } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  minW?: string;
};

const AppMenuSelect = <T extends string>({
  value,
  options,
  onChange,
  minW = "140px",
}: Props<T>) => {
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
    options.find((opt) => opt.value === value)?.label ?? "Select";

  return (
    <Box position="relative" ref={dropdownRef}>
      <Box
        onClick={() => setIsOpen((prev) => !prev)}
        cursor="pointer"
        px={3.5}
        h="40px"
        display="flex"
        alignItems="center"
        borderRadius="xl"
        border="1px solid"
        borderColor={isOpen ? "blue.400" : "border.muted"}
        boxShadow={
          isOpen
            ? "0 0 0 2px rgba(59, 130, 246, 0.15)"
            : "0 8px 18px rgba(15, 23, 42, 0.04)"
        }
        bg="bg.panel"
        minW={minW}
        transition="all 0.2s"
        _hover={{ borderColor: isOpen ? "blue.400" : "border.muted" }}
      >
        <HStack justify="space-between" w="full">
          <Text fontSize="sm" fontWeight="600" color="text.primary">
            {selectedLabel}
          </Text>
          <Box
            as={FiChevronDown}
            fontSize="14px"
            color="text.muted"
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
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AppMenuSelect;
