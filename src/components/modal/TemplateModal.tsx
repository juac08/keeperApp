import React from "react";
import { Box, Dialog, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import { FiX, FiLayers } from "react-icons/fi";
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
        <Dialog.Content
          borderRadius="2xl"
          maxW="960px"
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
                  bg="linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 10px 20px rgba(124, 58, 237, 0.25)"
                >
                  <FiLayers size={18} />
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color="text.muted"
                    textTransform="uppercase"
                    letterSpacing="0.12em"
                  >
                    Templates
                  </Text>
                  <Dialog.Title fontSize="lg" fontWeight="700">
                    Choose a template
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

          <Dialog.Body px={{ base: 6, md: 8 }} py={6}>
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
