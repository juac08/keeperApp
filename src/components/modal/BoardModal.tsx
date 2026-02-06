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
import { FiLayout } from "react-icons/fi";
import { AppButton, AppInput, AppTextarea, ModalHeader } from "@/ui";
import { useCreateBoardMutation, useCreateTagMutation } from "@/store";
import { BOARD_TEMPLATES, getTemplateConfig } from "@/config/boardTemplates";
import type { BoardTemplate } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { setActiveBoard } from "@/store";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const BoardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [createBoard] = useCreateBoardMutation();
  const [createTag] = useCreateTagMutation();
  const [selectedTemplate, setSelectedTemplate] =
    useState<BoardTemplate>("default");
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");

  const handleCreate = async () => {
    if (!boardName.trim()) return;

    const template = getTemplateConfig(selectedTemplate);
    const icon = template.icon;

    try {
      // Create the board
      const board = await createBoard({
        name: boardName.trim(),
        description: boardDescription.trim(),
        template: selectedTemplate,
        icon,
      }).unwrap();

      try {
        const iconMap = JSON.parse(
          localStorage.getItem("keeper.boardIcons") ?? "{}",
        );
        const templateMap = JSON.parse(
          localStorage.getItem("keeper.boardTemplates") ?? "{}",
        );
        iconMap[board.id] = icon;
        templateMap[board.id] = selectedTemplate;
        localStorage.setItem("keeper.boardIcons", JSON.stringify(iconMap));
        localStorage.setItem(
          "keeper.boardTemplates",
          JSON.stringify(templateMap),
        );
      } catch (error) {
        console.warn("Failed to persist board icon/template", error);
      }

      if (template.defaultTags.length > 0) {
        await Promise.all(
          template.defaultTags.map((tag) =>
            createTag({
              boardId: board.id,
              name: tag.name,
              color: tag.color,
            }).unwrap(),
          ),
        );
      }

      // Set the newly created board as active
      dispatch(setActiveBoard(board.id));

      // Reset form and close
      setBoardName("");
      setBoardDescription("");
      setSelectedTemplate("default");
      onClose();
    } catch (error) {
      console.error("Failed to create board:", error);
    }
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
          borderRadius="2xl"
          overflow="hidden"
          maxW="780px"
          boxShadow="0 24px 60px rgba(15, 23, 42, 0.18)"
          bg="bg.panel"
        >
          <ModalHeader
            label="Board"
            title="Create new board"
            icon={<FiLayout size={18} />}
            iconGradient="linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)"
            iconShadow="0 10px 20px rgba(37, 99, 235, 0.25)"
            onClose={handleClose}
          />

          <Dialog.Body bg="bg.panel" px={{ base: 6, md: 8 }} py={6}>
            <Stack gap={6}>
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
                  color="text.secondary"
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
                      bg={
                        selectedTemplate === key ? "blue.50" : "bg.panel"
                      }
                      border="2px solid"
                      borderColor={
                        selectedTemplate === key ? "blue.400" : "border.muted"
                      }
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => setSelectedTemplate(key as BoardTemplate)}
                      _hover={{
                        borderColor:
                          selectedTemplate === key ? "blue.500" : "text.muted",
                        bg: selectedTemplate === key ? "blue.100" : "bg.muted",
                      }}
                      transition="all 0.2s"
                      textAlign="left"
                    >
                      <HStack gap={3} align="flex-start">
                        <Box
                          w="28px"
                          h="28px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mt="2px"
                        >
                          <Text fontSize="22px" lineHeight="1">
                            {template.icon}
                          </Text>
                        </Box>
                        <Stack gap={1} flex="1">
                          <Text
                            fontSize="md"
                            fontWeight="600"
                            color="text.primary"
                          >
                            {template.name}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="text.muted"
                            lineHeight="1.45"
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
