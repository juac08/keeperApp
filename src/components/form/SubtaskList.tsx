import React, { useState } from "react";
import {
  Box,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { Subtask } from "@/types";

type Props = {
  subtasks: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
};

const SubtaskList: React.FC<Props> = ({ subtasks, onChange }) => {
  const [newSubtask, setNewSubtask] = useState("");

  const addSubtask = () => {
    if (!newSubtask.trim()) return;

    const subtask: Subtask = {
      id: `subtask-${Date.now()}`,
      text: newSubtask.trim(),
      completed: false,
    };

    onChange([...subtasks, subtask]);
    setNewSubtask("");
  };

  const toggleSubtask = (id: string) => {
    onChange(
      subtasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st,
      ),
    );
  };

  const removeSubtask = (id: string) => {
    onChange(subtasks.filter((st) => st.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
    }
  };

  const completedCount = subtasks.filter((st) => st.completed).length;

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <Text fontSize="sm" fontWeight="600" color="gray.700">
          Subtasks
        </Text>
        {subtasks.length > 0 && (
          <Text fontSize="xs" color="gray.500" fontWeight="500">
            {completedCount}/{subtasks.length}
          </Text>
        )}
      </HStack>

      <Stack gap={1}>
        {subtasks.map((subtask) => (
          <HStack
            key={subtask.id}
            role="group"
            py={1.5}
            px={1}
            gap={2}
            _hover={{ bg: "gray.50" }}
            borderRadius="md"
            transition="all 0.15s"
          >
            <Checkbox.Root
              checked={subtask.completed}
              onCheckedChange={() => toggleSubtask(subtask.id)}
              size="sm"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
            <Text
              flex="1"
              fontSize="sm"
              textDecoration={subtask.completed ? "line-through" : "none"}
              color={subtask.completed ? "gray.400" : "gray.700"}
            >
              {subtask.text}
            </Text>
            <IconButton
              aria-label="Delete subtask"
              size="xs"
              variant="ghost"
              onClick={() => removeSubtask(subtask.id)}
              opacity={0}
              _groupHover={{ opacity: 1 }}
              transition="opacity 0.15s"
            >
              <FiTrash2 size={14} />
            </IconButton>
          </HStack>
        ))}

        <HStack mt={2} gap={2}>
          <Box
            flex="1"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "16px",
              height: "16px",
              border: "2px solid",
              borderColor: "gray.300",
              borderRadius: "3px",
            }}
          >
            <Input
              placeholder="Add subtask"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={handleKeyPress}
              pl="28px"
              pr={3}
              py={1.5}
              h="auto"
              fontSize="sm"
              border="none"
              bg="transparent"
              _hover={{ bg: "gray.50" }}
              _focusVisible={{
                bg: "white",
                outline: "none",
                boxShadow: "none",
              }}
              _placeholder={{ color: "gray.400" }}
            />
          </Box>
        </HStack>
      </Stack>
    </Box>
  );
};

export default SubtaskList;
