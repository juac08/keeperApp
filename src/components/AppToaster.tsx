import React from "react";
import { Box, Toast, Toaster, createToaster } from "@chakra-ui/react";
import type { ToastOptions } from "@ark-ui/react/toast";
import { FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

export const appToaster = createToaster({
  placement: "top",
  duration: 3000,
  overlap: true,
});

const AppToaster: React.FC = () => {
  return (
    <Toaster toaster={appToaster} zIndex={9999} mt={4}>
      {(toast: ToastOptions) => {
        const isInfo = toast.type === "info";
        const iconColor = isInfo ? "blue.500" : "green.500";
        const Icon = isInfo ? FiInfo : FiCheckCircle;

        return (
          <Toast.Root
            key={toast.id}
            minW="0"
            maxW="400px"
            w="auto"
            px={4}
            pr={12}
            py={4}
            borderRadius="xl"
            fontSize="sm"
            boxShadow="lg"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            backdropFilter="blur(10px)"
          >
            <Box display="flex" alignItems="center" gap={3}>
              <Box
                flexShrink={0}
                w="20px"
                h="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={iconColor}
              >
                <Icon size={20} />
              </Box>
              <Box flex="1">
                <Toast.Title fontWeight="600" color="gray.900" lineHeight="1.4">
                  {toast.title}
                </Toast.Title>
                {toast.description && (
                  <Toast.Description mt={1} color="gray.600" lineHeight="1.5">
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
              color="gray.400"
              _hover={{ bg: "gray.100", color: "gray.600" }}
              transition="all 0.2s"
            >
              <FiX size={16} />
            </Toast.CloseTrigger>
          </Toast.Root>
        );
      }}
    </Toaster>
  );
};

export default AppToaster;
