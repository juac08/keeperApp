import React, { useState } from "react";
import {
  Badge,
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
  const inputRef = React.useRef<HTMLInputElement | null>(null);

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

  React.useEffect(() => {
    if (showInput) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [showInput]);

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <HStack gap={2} align="center">
          <Box as={FiCheckSquare} fontSize="16px" color="gray.600" />
          <Text fontSize="sm" fontWeight="600" color="text.primary">
            Subtasks
          </Text>
          <Badge
            px={2}
            py={0.5}
            borderRadius="full"
            fontSize="xs"
            fontWeight="700"
            bg="blue.50"
            color="blue.700"
          >
            {completedCount}/{subtasks.length}
          </Badge>
        </HStack>
        <IconButton
          aria-label="Add subtask"
          size="sm"
          onClick={() => {
            setShowInput(true);
          }}
          bg="blue.600"
          color="white"
          _hover={{ bg: "blue.700" }}
          _active={{ bg: "blue.800" }}
          borderRadius="full"
        >
          <FiPlus size={16} />
        </IconButton>
      </HStack>

      <Box
        borderRadius="xl"
        border="1px solid"
        borderColor="border.muted"
        bg="bg.panel"
        overflow="hidden"
      >
        <Stack gap={0}>
          {subtasks.length === 0 && !showInput ? (
            <Box
              textAlign="center"
              py={4}
              borderTop="1px dashed"
              borderColor="border.muted"
              bg="bg.muted"
            >
              <Text fontSize="sm" color="text.muted">
                No subtasks yet. Add one to break the work down.
              </Text>
            </Box>
          ) : (
            subtasks.map((subtask, index) => (
              <HStack
                key={subtask.id}
                py={2.5}
                px={3}
                gap={3}
                align="center"
                bg="bg.panel"
                borderTop={index === 0 ? "none" : "1px solid"}
                borderColor="border.muted"
                _hover={{ bg: "bg.muted" }}
                transition="all 0.15s"
                role="group"
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
                    px={3}
                    py={2}
                    h="40px"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="blue.300"
                    bg="white"
                    _focusVisible={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.15)",
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
                <HStack gap={1} opacity={0.8} _groupHover={{ opacity: 1 }}>
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
              </HStack>
            ))
          )}

          {showInput && (
            <Box
              px={3}
              py={3}
              borderTop="1px solid"
              borderColor="border.muted"
              bg="bg.muted"
            >
              <Input
                ref={inputRef}
                placeholder="Add subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={() => {
                  if (!newSubtask.trim()) {
                    setShowInput(false);
                  }
                }}
                px={4}
                py={2}
                h="44px"
                fontSize="sm"
                border="1px solid"
                borderColor="border.muted"
                borderRadius="lg"
                bg="white"
                _hover={{ borderColor: "blue.200" }}
                _focusVisible={{
                  outline: "none",
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.15)",
                }}
                _placeholder={{ color: "gray.400" }}
              />
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default SubtaskList;
