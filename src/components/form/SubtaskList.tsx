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
import { FiPlus, FiTrash2, FiEdit2, FiCheckSquare } from "react-icons/fi";
import type { Subtask } from "@/types";

type Props = {
  subtasks: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
};

const SubtaskList: React.FC<Props> = ({ subtasks, onChange }) => {
  const [newSubtask, setNewSubtask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

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

  const startEdit = (subtask: Subtask) => {
    setEditingId(subtask.id);
    setEditText(subtask.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      onChange(
        subtasks.map((st) =>
          st.id === id ? { ...st, text: editText.trim() } : st,
        ),
      );
    }
    setEditingId(null);
    setEditText("");
  };

  const handleEditKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditText("");
    }
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
        <HStack gap={2} align="center">
          <Box as={FiCheckSquare} fontSize="16px" color="gray" />
          <Text fontSize="sm" fontWeight="600" color="text.primary">
            Subtasks ({completedCount}/{subtasks.length})
          </Text>
        </HStack>
        <HStack gap={2}>
          <IconButton
            aria-label="Add subtask"
            size="xs"
            onClick={() => {
              setShowInput(true);
              // Focus the input after state updates
              setTimeout(() => {
                const input = document.querySelector(
                  'input[placeholder="Add subtask"]',
                ) as HTMLInputElement;
                if (input) input.focus();
              }, 0);
            }}
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            _active={{ bg: "blue.700" }}
            borderRadius="md"
          >
            <FiPlus size={14} />
          </IconButton>
        </HStack>
      </HStack>

      <Stack gap={1}>
        {subtasks.map((subtask) => (
          <HStack
            key={subtask.id}
            py={1.5}
            px={1}
            gap={2}
            _hover={{ bg: "gray.50", "& button": { opacity: 1 } }}
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
            {editingId === subtask.id ? (
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => handleEditKeyPress(e, subtask.id)}
                onBlur={() => saveEdit(subtask.id)}
                autoFocus
                flex="1"
                size="sm"
                fontSize="sm"
                px={2}
                py={1}
                h="auto"
                borderRadius="md"
                border="1px solid"
                borderColor="blue.400"
                _focusVisible={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px #4299e1",
                }}
              />
            ) : (
              <Text
                flex="1"
                fontSize="sm"
                textDecoration={subtask.completed ? "line-through" : "none"}
                color={subtask.completed ? "gray.400" : "gray.700"}
              >
                {subtask.text}
              </Text>
            )}
            <IconButton
              aria-label="Edit subtask"
              size="xs"
              variant="ghost"
              onClick={() => startEdit(subtask)}
              color="text.muted"
              _hover={{ color: "blue.600", bg: "blue.50" }}
            >
              <FiEdit2 size={14} />
            </IconButton>
            <IconButton
              aria-label="Delete subtask"
              size="xs"
              variant="ghost"
              onClick={() => removeSubtask(subtask.id)}
              color="text.muted"
              _hover={{ color: "red.600", bg: "red.50" }}
            >
              <FiTrash2 size={14} />
            </IconButton>
          </HStack>
        ))}

        {showInput && (
          <Input
            placeholder="Add subtask"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={() => {
              if (!newSubtask.trim()) {
                setShowInput(false);
              }
            }}
            px={3}
            py={1.5}
            h="auto"
            fontSize="sm"
            border="1px solid"
            borderColor="border.muted"
            borderRadius="6px"
            bg="bg.muted"
            mt={2}
            _hover={{ bg: "bg.muted", borderColor: "text.muted" }}
            _focusVisible={{
              bg: "bg.panel",
              outline: "none",
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px #4299e1",
            }}
            _placeholder={{ color: "gray.400" }}
          />
        )}
      </Stack>
    </Box>
  );
};

export default SubtaskList;
