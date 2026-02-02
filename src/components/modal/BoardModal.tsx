import React, { useState } from "react";
import {
  Box,
  Dialog,
  Field,
  Grid,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { AppButton, AppInput, AppTextarea } from "@/ui";
import { useBoardStore } from "@/state/BoardStore";
import { useTagsStore } from "@/state/TagsStore";
import { BOARD_TEMPLATES, getTemplateConfig } from "@/config/boardTemplates";
import type { BoardTemplate } from "@/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const BoardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addBoard } = useBoardStore();
  const { addTag } = useTagsStore();
  const [selectedTemplate, setSelectedTemplate] =
    useState<BoardTemplate>("default");
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");

  const handleCreate = () => {
    if (!boardName.trim()) return;

    const template = getTemplateConfig(selectedTemplate);

    // Create the board
    const newBoard = addBoard({
      name: boardName.trim(),
      description: boardDescription.trim(),
      template: selectedTemplate,
      icon: template.icon,
    });

    // Add default tags for the template
    template.defaultTags.forEach((tag) => {
      addTag(tag.label, tag.color, tag.icon);
    });

    // Reset form and close
    setBoardName("");
    setBoardDescription("");
    setSelectedTemplate("default");
    onClose();
  };

  const handleClose = () => {
    setBoardName("");
    setBoardDescription("");
    setSelectedTemplate("default");
    onClose();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && handleClose()}
    >
      <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <Dialog.Positioner>
        <Dialog.Content
          borderRadius="lg"
          overflow="hidden"
          maxW="700px"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.15)"
          bg="bg.panel"
        >
          <Dialog.Header
            bg="bg.panel"
            py={4}
            px={6}
            borderBottom="1px solid"
            borderColor="border.muted"
          >
            <HStack justify="space-between">
              <Text fontSize="md" fontWeight="600" color="text.primary">
                Create New Board
              </Text>
              <Dialog.CloseTrigger
                borderRadius="md"
                _hover={{ bg: "gray.100" }}
              >
                <FiX size={18} />
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>

          <Dialog.Body bg="bg.panel" px={6} py={6}>
            <Stack gap={5}>
              {/* Board Name */}
              <Field.Root>
                <Field.Label
                  fontSize="xs"
                  fontWeight="600"
                  color="text.secondary"
                  mb={2}
                >
                  BOARD NAME
                </Field.Label>
                <AppInput
                  placeholder="e.g., Product Launch Q1"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                />
              </Field.Root>

              {/* Board Description */}
              <Field.Root>
                <Field.Label
                  fontSize="xs"
                  fontWeight="600"
                  color="text.secondary"
                  mb={2}
                >
                  DESCRIPTION (OPTIONAL)
                </Field.Label>
                <AppTextarea
                  placeholder="Describe what this board is for..."
                  value={boardDescription}
                  onChange={(e) => setBoardDescription(e.target.value)}
                  rows={2}
                />
              </Field.Root>

              {/* Template Selection */}
              <Field.Root>
                <Field.Label
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.600"
                  mb={3}
                >
                  CHOOSE TEMPLATE
                </Field.Label>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={3}
                >
                  {Object.entries(BOARD_TEMPLATES).map(([key, template]) => (
                    <Box
                      key={key}
                      as="button"
                      p={4}
                      bg={selectedTemplate === key ? "blue.50" : "white"}
                      border="2px solid"
                      borderColor={
                        selectedTemplate === key ? "blue.400" : "gray.200"
                      }
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => setSelectedTemplate(key as BoardTemplate)}
                      _hover={{
                        borderColor:
                          selectedTemplate === key ? "blue.500" : "gray.300",
                        bg: selectedTemplate === key ? "blue.100" : "gray.50",
                      }}
                      transition="all 0.2s"
                      textAlign="left"
                    >
                      <HStack gap={3} align="flex-start">
                        <Text fontSize="2xl">{template.icon}</Text>
                        <Stack gap={1} flex="1">
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="text.primary"
                          >
                            {template.name}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="text.muted"
                            lineHeight="1.4"
                          >
                            {template.description}
                          </Text>
                        </Stack>
                      </HStack>
                    </Box>
                  ))}
                </Grid>
              </Field.Root>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer
            bg="bg.panel"
            py={4}
            px={6}
            borderTop="1px solid"
            borderColor="border.muted"
          >
            <HStack justify="flex-end" w="100%" gap={3}>
              <AppButton variantStyle="ghost" onClick={handleClose}>
                Cancel
              </AppButton>
              <AppButton
                variantStyle="primary"
                onClick={handleCreate}
                disabled={!boardName.trim()}
              >
                Create Board
              </AppButton>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default BoardModal;
