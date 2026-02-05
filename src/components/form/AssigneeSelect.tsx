import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FiCheck, FiUser, FiX } from "react-icons/fi";
import { useAssigneesStore } from "@/state/AssigneesStore";
import type { Assignee } from "@/types";

type Props = {
  value?: string;
  onChange: (assigneeId: string | undefined) => void;
};

const AssigneeSelect: React.FC<Props> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { assignees, getAssignee } = useAssigneesStore();

  const filteredAssignees = assignees.filter(
    (assignee) => !assignee.isSuperAdmin && assignee.name !== "System Admin",
  );
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
      <HStack gap={2} align="stretch">
        <Box
          onClick={() => setIsOpen((prev) => !prev)}
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
          flex="1"
          minW="200px"
        >
          <HStack gap={2}>
            {selectedAssignee ? (
              <Text fontSize="sm" fontWeight="600" color="text.primary">
                {selectedAssignee.name}
              </Text>
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
            borderRadius="xl"
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
          bottom="calc(100% + 8px)"
          left="0"
          minW="100%"
          w="100%"
          maxW="400px"
          bg="bg.panel"
          borderRadius="xl"
          boxShadow="0 16px 40px rgba(15, 23, 42, 0.12)"
          border="1px solid"
          borderColor="border.muted"
          py={3}
          zIndex={1000}
          maxH="300px"
          display="flex"
          flexDirection="column"
          overflowX="hidden"
          overflowY="auto"
          overscrollBehavior="contain"
        >
          {filteredAssignees.length === 0 && (
            <Box px={4} py={6} textAlign="center" color="text.muted">
              <Text fontSize="sm" fontWeight="500">
                No assignees available
              </Text>
            </Box>
          )}

          {filteredAssignees.map((assignee: Assignee) => (
            <Box
              key={assignee.id}
              px={4}
              py={3}
              mx={2}
              cursor="pointer"
              borderRadius="lg"
              _hover={{ bg: "bg.muted", transform: "translateX(4px)" }}
              transition="all 0.15s"
              onClick={() => handleSelect(assignee.id)}
            >
              <HStack justify="space-between">
                <Text fontSize="sm" fontWeight="500">
                  {assignee.name}
                </Text>
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
