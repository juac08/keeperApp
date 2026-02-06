import React from "react";
import { Box, Dialog, HStack, Text } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import AppIconButton from "./AppIconButton";

type Props = {
  label?: string;
  title: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconGradient?: string;
  iconColor?: string;
  iconShadow?: string;
  rightSlot?: React.ReactNode;
  onClose: () => void;
};

const ModalHeader: React.FC<Props> = ({
  label,
  title,
  icon,
  iconBg = "bg.muted",
  iconGradient,
  iconColor = "white",
  iconShadow,
  rightSlot,
  onClose,
}) => {
  return (
    <Dialog.Header
      py={5}
      px={{ base: 6, md: 8 }}
      borderBottom="1px solid"
      borderColor="border.muted"
      bg="bg.panel"
    >
      <HStack justify="space-between" align="center">
        <HStack gap={3} align="center">
          {icon && (
            <Box
              w="40px"
              h="40px"
              borderRadius="14px"
              bg={iconGradient ? undefined : iconBg}
              bgGradient={iconGradient}
              color={iconColor}
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow={iconShadow}
            >
              {icon}
            </Box>
          )}
          <Box>
            {label && (
              <Text
                fontSize="xs"
                fontWeight="700"
                color="text.muted"
                textTransform="uppercase"
                letterSpacing="0.12em"
              >
                {label}
              </Text>
            )}
            <Dialog.Title fontSize="lg" fontWeight="700" color="text.primary">
              {title}
            </Dialog.Title>
          </Box>
        </HStack>
        <HStack gap={3}>
          {rightSlot}
          <Dialog.CloseTrigger asChild>
            <AppIconButton aria-label="Close" size="sm" onClick={onClose}>
              <FiX size={18} />
            </AppIconButton>
          </Dialog.CloseTrigger>
        </HStack>
      </HStack>
    </Dialog.Header>
  );
};

export default ModalHeader;
