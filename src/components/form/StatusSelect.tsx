import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import type { Status } from "@/types";

type Props = {
  value: Status;
  onChange: (status: Status) => void;
  size?: "sm" | "md";
};

const statuses: { value: Status; label: string; color: string }[] = [
  { value: "todo", label: "To Do", color: "gray" },
  { value: "inprogress", label: "In Progress", color: "blue" },
  { value: "done", label: "Complete", color: "green" },
];

const StatusSelect: React.FC<Props> = ({ value, onChange, size = "md" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedStatus = statuses.find((s) => s.value === value);

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

  const handleSelect = (status: Status) => {
    onChange(status);
    setIsOpen(false);
  };

  return (
    <Box position="relative" ref={dropdownRef}>
      <Box
        onClick={() => setIsOpen(!isOpen)}
        cursor="pointer"
        px={4}
        py={3}
        borderRadius="xl"
        border="1px solid"
        borderColor={isOpen ? "blue.400" : "border.muted"}
        boxShadow={isOpen ? "0 0 0 3px rgba(59, 130, 246, 0.15)" : "none"}
        bg="bg.panel"
        _hover={{ borderColor: isOpen ? "blue.400" : "blue.200" }}
        transition="all 0.2s"
      >
        <HStack justify="space-between">
          <HStack gap={2}>
            {selectedStatus && (
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={`${selectedStatus.color}.500`}
              />
            )}
            <Text fontSize={size === "sm" ? "sm" : "md"} fontWeight="600">
              {selectedStatus?.label || "Select status"}
            </Text>
          </HStack>
          <Box
            as={FiChevronDown}
            fontSize="16px"
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
          borderRadius="xl"
          boxShadow="0 16px 40px rgba(15, 23, 42, 0.12)"
          border="1px solid"
          borderColor="border.muted"
          py={2}
          zIndex={10}
        >
          {statuses.map((status) => (
            <Box
              key={status.value}
              px={4}
              py={2.5}
              cursor="pointer"
              _hover={{ bg: "bg.muted", transform: "translateX(4px)" }}
              transition="all 0.2s"
              onClick={() => handleSelect(status.value)}
            >
              <HStack justify="space-between">
                <HStack gap={2}>
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={`${status.color}.500`}
                  />
                  <Text fontSize="sm" fontWeight="500" whiteSpace="nowrap">
                    {status.label}
                  </Text>
                </HStack>
                {value === status.value && (
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

export default StatusSelect;
