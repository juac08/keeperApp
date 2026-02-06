import React from "react";
import { Box, Toast, Toaster, createToaster } from "@chakra-ui/react";
import type { ToastOptions } from "@ark-ui/react/toast";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const MotionBox = motion(Box);

export const appToaster = createToaster({
  placement: "top",
  duration: 3000,
  overlap: true,
});

const AppToaster: React.FC = () => {
  return (
    <Toaster toaster={appToaster} zIndex={9999} mt={4}>
      {(toast: ToastOptions) => {
        const rawType =
          toast.type ||
          (toast as { status?: string }).status ||
          (toast as { variant?: string }).variant ||
          "info";
        const type = rawType.toLowerCase();
        const isInfo = type === "info";
        const isError = type === "error";
        const isWarning = type === "warning";
        const iconColor = isError
          ? "red.500"
          : isWarning
            ? "orange.400"
            : isInfo
              ? "blue.500"
              : "green.500";
        const isDark =
          typeof document !== "undefined" &&
          document.documentElement.getAttribute("data-theme") === "dark";
        const Icon = isError
          ? FiAlertTriangle
          : isWarning
            ? FiAlertTriangle
            : isInfo
              ? FiInfo
              : FiCheckCircle;

        return (
          <MotionBox
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            position="fixed"
            left="50%"
            transform="translateX(-50%)"
          >
            <Toast.Root
              key={toast.id}
              minW="320px"
              maxW="420px"
              w="auto"
              px={4}
              pr={12}
              py={3.5}
              borderRadius="xl"
              fontSize="sm"
              boxShadow="lg"
              bg="bg.panel"
              border="2px solid"
              borderColor="border.muted"
              backdropFilter="blur(10px)"
            >
              <Box display="flex" alignItems="flex-start" gap={3}>
                <Box
                  flexShrink={0}
                  w="20px"
                  h="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color={iconColor}
                  mt="1px"
                >
                  <Icon size={20} />
                </Box>
                <Box flex="1" minW="0">
                  <Toast.Title
                    fontWeight="600"
                    color={isDark ? "text.primary" : "gray.900"}
                    lineHeight="1.5"
                    wordBreak="break-word"
                  >
                    {toast.title}
                  </Toast.Title>
                  {toast.description && (
                    <Toast.Description
                      mt={1}
                      color={isDark ? "text.secondary" : "gray.600"}
                      lineHeight="1.5"
                      wordBreak="break-word"
                    >
                      {toast.description}
                    </Toast.Description>
                  )}
                </Box>
              </Box>
              <Toast.CloseTrigger
                position="absolute"
                top="14px"
                right="14px"
                borderRadius="md"
                w="20px"
                h="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={isDark ? "text.muted" : "gray.400"}
                _hover={{
                  bg: isDark ? "bg.muted" : "gray.100",
                  color: isDark ? "text.primary" : "gray.600",
                }}
                transition="all 0.2s"
              >
                <FiX size={16} />
              </Toast.CloseTrigger>
            </Toast.Root>
          </MotionBox>
        );
      }}
    </Toaster>
  );
};

export default AppToaster;
