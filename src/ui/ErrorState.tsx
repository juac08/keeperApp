import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi";

type Props = BoxProps & {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

const ErrorState: React.FC<Props> = ({
  title = "Something went wrong",
  description,
  action,
  ...props
}) => {
  return (
    <Box
      bg="bg.panel"
      border="1px solid"
      borderColor="border.muted"
      borderRadius="2xl"
      p={6}
      {...props}
    >
      <VStack gap={3} align="center" textAlign="center">
        <Box
          w="40px"
          h="40px"
          borderRadius="full"
          bg="red.50"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <FiAlertTriangle color="#dc2626" />
        </Box>
        <Text fontWeight="700" color="text.primary">
          {title}
        </Text>
        {description && (
          <Text fontSize="sm" color="text.muted">
            {description}
          </Text>
        )}
        {action}
      </VStack>
    </Box>
  );
};

export default ErrorState;
