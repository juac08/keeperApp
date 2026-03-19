import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
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

  const handleSelect = (value: DensityMode) => {
    setDensity(value);
    setIsOpen(false);
  };

  return (
    <Box position="relative" ref={dropdownRef}>
      <AppIconButton
        aria-label="Change card density"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Box
          w="10px"
          h="18px"
          borderRadius="3px"
          border="2px solid"
          borderColor="currentColor"
        />
      </AppIconButton>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          right="0"
          minW="180px"
          bg="bg.panel"
          border="1px solid"
          borderColor="border.muted"
          borderRadius="control"
          boxShadow="0 4px 24px rgba(0, 0, 0, 0.1)"
          zIndex={10}
          overflow="hidden"
        >
          {options.map((option) => (
            <Box
              key={option.value}
              px={4}
              py={2.5}
              cursor="pointer"
              bg={density === option.value ? "bg.subtle" : "bg.panel"}
              color={density === option.value ? "blue.400" : "text.primary"}
              fontWeight={density === option.value ? "600" : "400"}
              fontSize="sm"
              transition="all 0.15s"
              _hover={{
                bg: density === option.value ? "bg.subtle" : "bg.muted",
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
