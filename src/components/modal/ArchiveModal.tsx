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
          borderRadius="2xl"
          maxW="900px"
          maxH="90vh"
          overflow="hidden"
          boxShadow="0 24px 60px rgba(15, 23, 42, 0.18)"
          bg="bg.panel"
        >
          <Dialog.Header
            py={5}
            px={{ base: 6, md: 8 }}
            borderBottom="1px solid"
            borderColor="border.muted"
          >
            <HStack justify="space-between">
              <HStack gap={3} align="center">
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="14px"
                  bg="linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 10px 20px rgba(99, 102, 241, 0.25)"
                >
                  <FiArchive size={18} />
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color="text.muted"
                    textTransform="uppercase"
                    letterSpacing="0.12em"
                  >
                    Archive
                  </Text>
                  <Dialog.Title fontSize="lg" fontWeight="700">
                    Archived tasks ({archivedCards.length})
                  </Dialog.Title>
                </Box>
              </HStack>
              <Dialog.CloseTrigger asChild>
                <AppIconButton aria-label="Close" size="sm" onClick={onClose}>
                  <FiX size={18} />
                </AppIconButton>
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>

          <Dialog.Body px={{ base: 6, md: 8 }} py={6} overflowY="auto">
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
                    bg="bg.muted"
                    border="1px solid"
                    borderColor="border.muted"
                    borderRadius="xl"
                    p={4}
                    boxShadow="0 10px 22px rgba(15, 23, 42, 0.06)"
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
