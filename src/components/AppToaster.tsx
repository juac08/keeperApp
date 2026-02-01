import React from "react";
import { Toast, Toaster, createToaster } from "@chakra-ui/react";
import type { ToastOptions } from "@ark-ui/react/toast";

export const appToaster = createToaster({
  placement: "top",
  duration: 2000,
});

const AppToaster: React.FC = () => {
  return (
    <Toaster toaster={appToaster} zIndex={2000} mt={3}>
      {(toast: ToastOptions) => (
        <Toast.Root
          key={toast.id}
          minW="0"
          maxW="360px"
          w="auto"
          px={4}
          py={3}
          borderRadius="lg"
          fontSize="sm"
          boxShadow="soft"
        >
          <Toast.Title fontWeight="600">{toast.title}</Toast.Title>
          {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
          <Toast.CloseTrigger
            position="absolute"
            top="10px"
            right="10px"
            borderRadius="full"
            bg="bg.muted"
            color="gray.600"
            _hover={{ bg: "gray.200", color: "gray.800" }}
          />
        </Toast.Root>
      )}
    </Toaster>
  );
};

export default AppToaster;
