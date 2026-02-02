import React from "react";
import { Box, Dialog, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { CARD_TEMPLATES, type CardTemplate } from "@/config/cardTemplates";
import { AppIconButton } from "@/ui";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CardTemplate) => void;
};

export const TemplateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const handleSelect = (template: CardTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} size="xl">
      <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <Dialog.Positioner>
        <Dialog.Content borderRadius="lg" maxW="900px">
          <Dialog.Header
            py={4}
            px={6}
            borderBottom="1px solid"
            borderColor="border.muted"
          >
            <HStack justify="space-between">
              <Dialog.Title fontSize="lg" fontWeight="600">
                Choose a template
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <AppIconButton aria-label="Close" size="sm" onClick={onClose}>
                  <FiX size={18} />
                </AppIconButton>
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>

          <Dialog.Body px={6} py={6}>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={4}
            >
              {CARD_TEMPLATES.map((template) => (
                <Box
                  key={template.id}
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  p={5}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: "blue.400",
                    bg: "blue.50",
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                  }}
                  onClick={() => handleSelect(template)}
                >
                  <VStack align="flex-start" gap={2}>
                    <Text fontSize="3xl">{template.icon}</Text>
                    <Text fontSize="md" fontWeight="600">
                      {template.name}
                    </Text>
                    <Text fontSize="xs" color="text.muted">
                      {template.description}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </Grid>
          </Dialog.Body>

          <Dialog.Footer
            py={3}
            px={6}
            borderTop="1px solid"
            borderColor="border.muted"
            bg="bg.panel"
          >
            <Text fontSize="xs" color="text.muted">
              Select a template to quickly create a task with pre-filled content
            </Text>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
