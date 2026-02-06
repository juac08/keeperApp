import React, { useRef } from "react";
import { Box, HStack, Text, Dialog, Stack } from "@chakra-ui/react";
import { FiDownload, FiUpload, FiX } from "react-icons/fi";
import { AppButton, ModalHeader } from "@/ui";
import { exportBoardToJSON, importBoardFromJSON } from "@/utils/exportImport";
import type { Card } from "@/types";
import { appToaster } from "@/shared";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardName: string;
  cards: Card[];
  onImport: (cards: Card[]) => void;
};

export const ExportImportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  boardId,
  boardName,
  cards,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportBoardToJSON(boardId, boardName, cards);
    appToaster.success({
      title: "Board exported successfully",
      duration: 2000,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importBoardFromJSON(file);
      onImport(data.cards);
      appToaster.success({
        title: `Imported ${data.cards.length} tasks`,
        duration: 2000,
      });
      onClose();
    } catch (error) {
      appToaster.error({
        title: "Import failed",
        description:
          error instanceof Error ? error.message : "Invalid file format",
        duration: 3000,
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <Dialog.Positioner>
        <Dialog.Content
          borderRadius="2xl"
          maxW="720px"
          overflow="hidden"
          boxShadow="0 24px 60px rgba(15, 23, 42, 0.18)"
          bg="bg.panel"
        >
          <ModalHeader
            label="Transfer"
            title="Export & import board"
            icon={<FiDownload size={18} />}
            iconGradient="linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)"
            iconShadow="0 10px 20px rgba(14, 165, 233, 0.25)"
            onClose={onClose}
          />

          <Dialog.Body px={{ base: 6, md: 8 }} py={6}>
            <Stack gap={4}>
              <Box
                border="1px solid"
                borderColor="border.muted"
                borderRadius="xl"
                p={{ base: 5, md: 6 }}
                bg="linear-gradient(180deg, #f5f8ff 0%, #eef3ff 100%)"
                boxShadow="0 12px 26px rgba(37, 99, 235, 0.12)"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)" }}
                onClick={handleExport}
              >
                <HStack gap={4} align="center">
                  <Box
                    w="48px"
                    h="48px"
                    borderRadius="16px"
                    bg="bg.panel"
                    border="1px solid"
                    borderColor="border.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="blue.600"
                  >
                    <FiDownload size={20} />
                  </Box>
                  <Box>
                    <Text fontSize="md" fontWeight="700" mb={1}>
                      Export board
                    </Text>
                    <Text fontSize="sm" color="text.muted">
                      Download {cards.length} tasks as a JSON snapshot
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <Box
                border="1px solid"
                borderColor="border.muted"
                borderRadius="xl"
                p={{ base: 5, md: 6 }}
                bg="linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)"
                boxShadow="0 12px 26px rgba(16, 185, 129, 0.12)"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)" }}
                onClick={handleImportClick}
              >
                <HStack gap={4} align="center">
                  <Box
                    w="48px"
                    h="48px"
                    borderRadius="16px"
                    bg="bg.panel"
                    border="1px solid"
                    borderColor="border.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="green.600"
                  >
                    <FiUpload size={20} />
                  </Box>
                  <Box>
                    <Text fontSize="md" fontWeight="700" mb={1}>
                      Import board
                    </Text>
                    <Text fontSize="sm" color="text.muted">
                      Upload a JSON file to restore tasks
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </Stack>
          </Dialog.Body>

          <Dialog.Footer
            py={4}
            px={6}
            borderTop="1px solid"
            borderColor="border.muted"
            bg="bg.panel"
          >
            <AppButton onClick={onClose}>Close</AppButton>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
