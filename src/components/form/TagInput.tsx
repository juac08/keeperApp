import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Badge, Field, Text } from "@chakra-ui/react";
import { FiX, FiPlus, FiTag } from "react-icons/fi";
import { useTagsStore } from "@/state/TagsStore";
import type { Tag } from "@/types";

type Props = {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
};

const TagInput: React.FC<Props> = ({
  selectedTags,
  onChange,
  label = "Tags",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { tags } = useTagsStore();

  const availableTags = tags.filter(
    (tag: Tag) => !selectedTags.includes(tag.id),
  );

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

  const handleAddTag = (tagId: string) => {
    onChange([...selectedTags, tagId]);
    setIsOpen(false);
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTags.filter((id) => id !== tagId));
  };

  return (
    <Box>
      <Field.Label fontSize="sm" color="text.primary" fontWeight="600" mb={2.5}>
        {label}
      </Field.Label>
      <Box position="relative" ref={dropdownRef}>
        <Box
          px={4}
          py={3}
          minH="52px"
          borderRadius="6px"
          border="1px solid"
          borderColor={isOpen ? "blue.400" : "border.muted"}
          boxShadow={isOpen ? "0 0 0 1px #4299e1" : "none"}
          bg="bg.panel"
          _hover={{ borderColor: isOpen ? "blue.400" : "gray.300" }}
          transition="all 0.2s"
        >
          <HStack gap={2} flexWrap="wrap">
            {selectedTags.map((tagId) => {
              const tag = tags.find((t: Tag) => t.id === tagId);
              if (!tag) return null;
              return (
                <Badge
                  key={tag.id}
                  colorScheme={tag.color}
                  variant="solid"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="600"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  boxShadow="sm"
                >
                  <span>{tag.icon}</span>
                  <span>{tag.label}</span>
                  <Box
                    as="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    color="whiteAlpha.900"
                    opacity={0.8}
                    _hover={{ opacity: 1 }}
                    display="flex"
                    alignItems="center"
                  >
                    <FiX size={14} />
                  </Box>
                </Badge>
              );
            })}
            <Box
              as="button"
              onClick={() => setIsOpen(!isOpen)}
              px={3}
              py={1.5}
              borderRadius="lg"
              bg={isOpen ? "blue.50" : "bg.muted"}
              color={isOpen ? "blue.700" : "text.primary"}
              _hover={{ bg: "blue.50", color: "blue.700" }}
              display="flex"
              alignItems="center"
              gap={2}
              fontSize="sm"
              fontWeight="600"
              transition="all 0.2s"
            >
              <FiPlus size={16} />
              <span>Add tag</span>
            </Box>
          </HStack>
        </Box>

        {isOpen && availableTags.length > 0 && (
          <Box
            position="absolute"
            bottom="calc(100% + 8px)"
            left="0"
            minW="100%"
            w="max-content"
            bg="bg.panel"
            borderRadius="xl"
            boxShadow="0 10px 40px rgba(0, 0, 0, 0.15)"
            border="1px solid"
            borderColor="border.muted"
            py={2}
            zIndex={1000}
            maxH="240px"
            overflowY="auto"
            overflowX="hidden"
          >
            {availableTags.map((tag: Tag) => (
              <Box
                key={tag.id}
                px={4}
                py={2.5}
                mx={2}
                cursor="pointer"
                borderRadius="lg"
                _hover={{ bg: "bg.muted", transform: "translateX(4px)" }}
                transition="all 0.2s"
                onClick={() => handleAddTag(tag.id)}
              >
                <HStack gap={3}>
                  <Box
                    fontSize="20px"
                    w="32px"
                    h="32px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                    bg={`${tag.color}.50`}
                  >
                    {tag.icon}
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="600" color="text.primary">
                      {tag.label}
                    </Text>
                    <Text fontSize="xs" color="text.muted">
                      {tag.color.charAt(0).toUpperCase() + tag.color.slice(1)}{" "}
                      tag
                    </Text>
                  </Box>
                </HStack>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TagInput;
