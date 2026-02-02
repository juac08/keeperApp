import React, { useRef } from "react";
import { Box, HStack, VStack, Text, Dialog } from "@chakra-ui/react";
import { FiDownload, FiUpload, FiX } from "react-icons/fi";
import { AppButton, AppIconButton } from "@/ui";
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
        <Dialog.Content borderRadius="lg" maxW="500px">
          <Dialog.Header
            py={4}
            px={6}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <HStack justify="space-between">
              <Dialog.Title fontSize="lg" fontWeight="600">
                Export / Import Board
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <AppIconButton aria-label="Close" size="sm" onClick={onClose}>
                  <FiX size={18} />
                </AppIconButton>
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>

          <Dialog.Body px={6} py={6}>
            <VStack gap={4} align="stretch">
              <Box
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="xl"
                p={6}
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                onClick={handleExport}
              >
                <FiDownload size={32} style={{ margin: "0 auto 12px" }} />
                <Text fontSize="md" fontWeight="600" mb={1}>
                  Export Board
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Download {cards.length} tasks as JSON
                </Text>
              </Box>

              <Box
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="xl"
                p={6}
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: "green.400", bg: "green.50" }}
                onClick={handleImportClick}
              >
                <FiUpload size={32} style={{ margin: "0 auto 12px" }} />
                <Text fontSize="md" fontWeight="600" mb={1}>
                  Import Board
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Upload JSON file to restore tasks
                </Text>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </VStack>
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
