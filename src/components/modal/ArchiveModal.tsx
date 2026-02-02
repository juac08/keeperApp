import React from "react";
import { Box, HStack, VStack, Text, Dialog, Stack } from "@chakra-ui/react";
import { FiArchive, FiRotateCcw, FiTrash2, FiX } from "react-icons/fi";
import { useArchiveStore } from "@/state/ArchiveStore";
import { AppButton, AppIconButton } from "@/ui";
import type { Card } from "@/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (card: Card) => void;
};

export const ArchiveModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRestore,
}) => {
  const { archivedCards, restoreCard, deleteArchivedCard, clearArchive } =
    useArchiveStore();

  const handleRestore = (id: string) => {
    const card = restoreCard(id);
    if (card) {
      onRestore(card);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} size="xl">
      <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <Dialog.Positioner>
        <Dialog.Content
          borderRadius="lg"
          maxW="800px"
          maxH="90vh"
          overflow="hidden"
        >
          <Dialog.Header
            py={4}
            px={6}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <HStack justify="space-between">
              <HStack gap={2}>
                <FiArchive size={20} />
                <Dialog.Title fontSize="lg" fontWeight="600">
                  Archive ({archivedCards.length})
                </Dialog.Title>
              </HStack>
              <Dialog.CloseTrigger asChild>
                <AppIconButton aria-label="Close" size="sm" onClick={onClose}>
                  <FiX size={18} />
                </AppIconButton>
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>

          <Dialog.Body px={6} py={6} overflowY="auto">
            {archivedCards.length === 0 ? (
              <Box textAlign="center" py={12}>
                <Text fontSize="5xl" mb={4}>
                  📦
                </Text>
                <Text fontSize="lg" fontWeight="500" color="gray.700" mb={2}>
                  Archive is empty
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Completed tasks will appear here when archived
                </Text>
              </Box>
            ) : (
              <Stack gap={3}>
                {archivedCards.map((card) => (
                  <Box
                    key={card.id}
                    bg="gray.50"
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                  >
                    <HStack justify="space-between" align="flex-start">
                      <VStack align="flex-start" flex="1" gap={1}>
                        <Text fontWeight="600" fontSize="sm">
                          {card.title || "Untitled"}
                        </Text>
                        {card.content && (
                          <Text fontSize="xs" color="gray.600" lineClamp={2}>
                            {card.content}
                          </Text>
                        )}
                        <Text fontSize="2xs" color="gray.400">
                          Archived{" "}
                          {new Date(
                            (card as any).archivedAt || card.updatedAt,
                          ).toLocaleDateString()}
                        </Text>
                      </VStack>
                      <HStack gap={2}>
                        <AppIconButton
                          aria-label="Restore"
                          size="sm"
                          onClick={() => handleRestore(card.id)}
                          title="Restore to board"
                        >
                          <FiRotateCcw size={16} />
                        </AppIconButton>
                        <AppIconButton
                          aria-label="Delete"
                          size="sm"
                          onClick={() => deleteArchivedCard(card.id)}
                          title="Delete permanently"
                        >
                          <FiTrash2 size={16} color="#ef4444" />
                        </AppIconButton>
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </Stack>
            )}
          </Dialog.Body>

          {archivedCards.length > 0 && (
            <Dialog.Footer
              py={4}
              px={6}
              borderTop="1px solid"
              borderColor="border.muted"
              bg="bg.panel"
            >
              <HStack justify="space-between" w="full">
                <AppButton
                  size="sm"
                  variantStyle="ghost"
                  onClick={clearArchive}
                  color="red.600"
                >
                  Clear all
                </AppButton>
                <AppButton onClick={onClose}>Close</AppButton>
              </HStack>
            </Dialog.Footer>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
