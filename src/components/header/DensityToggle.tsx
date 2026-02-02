import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { useDensityStore, type DensityMode } from "@/state/DensityStore";
import { AppIconButton } from "@/ui";

const options: { value: DensityMode; label: string; icon: string }[] = [
  { value: "compact", label: "Compact", icon: "▬" },
  { value: "comfortable", label: "Comfortable", icon: "▭" },
  { value: "spacious", label: "Spacious", icon: "▯" },
];

export const DensityToggle: React.FC = () => {
  const { density, setDensity } = useDensityStore();
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

  const selectedOption = options.find((opt) => opt.value === density);

  const handleSelect = (value: DensityMode) => {
    setDensity(value);
    setIsOpen(false);
  };

  return (
    <Box position="relative" ref={dropdownRef}>
      <AppIconButton
        aria-label="Change card density"
        onClick={() => setIsOpen(!isOpen)}
        size="md"
      >
        {selectedOption?.icon}
      </AppIconButton>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          right="0"
          minW="180px"
          bg="bg.panel"
          border="2px solid"
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
              bg={density === option.value ? "blue.50" : "white"}
              color={density === option.value ? "blue.600" : "gray.700"}
              fontWeight={density === option.value ? "600" : "400"}
              fontSize="sm"
              transition="all 0.15s"
              _hover={{
                bg: density === option.value ? "blue.50" : "gray.50",
              }}
              onClick={() => handleSelect(option.value)}
            >
              <HStack gap={2}>
                <Text fontSize="lg">{option.icon}</Text>
                <Text>{option.label}</Text>
              </HStack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
