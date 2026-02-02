import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FiCheck, FiUser, FiX } from "react-icons/fi";
import { useAssigneesStore } from "@/state/AssigneesStore";
import type { Assignee } from "@/types";

type Props = {
  value?: string;
  onChange: (assigneeId: string | undefined) => void;
  label?: string;
};

const AssigneeSelect: React.FC<Props> = ({
  value,
  onChange,
  label = "Assignee",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { assignees, getAssignee } = useAssigneesStore();

  const selectedAssignee = value ? getAssignee(value) : undefined;

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

  const handleSelect = (assigneeId: string) => {
    onChange(assigneeId);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  return (
    <Box position="relative" ref={dropdownRef}>
      <HStack gap={2}>
        <Box
          onClick={() => setIsOpen(!isOpen)}
          cursor="pointer"
          px={4}
          py={2.5}
          borderRadius="6px"
          border="1px solid"
          borderColor={isOpen ? "blue.400" : "border.muted"}
          boxShadow={isOpen ? "0 0 0 1px #4299e1" : "none"}
          bg="bg.panel"
          _hover={{ borderColor: isOpen ? "blue.400" : "gray.300" }}
          transition="all 0.2s"
          flex="1"
        >
          <HStack gap={2}>
            {selectedAssignee ? (
              <>
                <Box fontSize="lg">{selectedAssignee.avatar || "👤"}</Box>
                <Text fontSize="sm" fontWeight="500">
                  {selectedAssignee.name}
                </Text>
              </>
            ) : (
              <>
                <Box as={FiUser} fontSize="16px" color="text.muted" />
                <Text fontSize="sm" color="text.muted">
                  Unassigned
                </Text>
              </>
            )}
          </HStack>
        </Box>
        {value && (
          <Box
            as="button"
            onClick={handleClear}
            p={2}
            borderRadius="lg"
            border="1px solid"
            borderColor="border.muted"
            bg="bg.panel"
            color="text.secondary"
            _hover={{
              bg: "red.50",
              borderColor: "red.300",
              color: "red.600",
            }}
            transition="all 0.2s"
            aria-label="Clear assignee"
          >
            <FiX size={18} />
          </Box>
        )}
      </HStack>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          left="0"
          minW="100%"
          w="max-content"
          bg="bg.panel"
          borderRadius="xl"
          boxShadow="0 10px 40px rgba(0, 0, 0, 0.15)"
          border="2px solid"
          borderColor="blue.100"
          py={2}
          zIndex={1000}
          maxH="280px"
          overflowY="auto"
          overflowX="hidden"
        >
          {assignees.map((assignee: Assignee) => (
            <Box
              key={assignee.id}
              px={4}
              py={3}
              mx={2}
              cursor="pointer"
              borderRadius="lg"
              _hover={{ bg: "blue.50" }}
              transition="all 0.15s"
              onClick={() => handleSelect(assignee.id)}
            >
              <HStack justify="space-between">
                <HStack gap={2}>
                  <Box fontSize="lg">{assignee.avatar || "👤"}</Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="500">
                      {assignee.name}
                    </Text>
                    {assignee.email && (
                      <Text fontSize="xs" color="gray.500">
                        {assignee.email}
                      </Text>
                    )}
                  </Box>
                </HStack>
                {value === assignee.id && (
                  <Box
                    as={FiCheck}
                    fontSize="16px"
                    color="blue.600"
                    fontWeight="bold"
                  />
                )}
              </HStack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AssigneeSelect;
