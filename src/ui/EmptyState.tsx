import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

type Props = BoxProps & {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

const EmptyState: React.FC<Props> = ({
  icon,
  title,
  description,
  action,
  ...props
}) => {
  return (
    <Box
      textAlign="center"
      border="1.5px dashed"
      borderColor="border.muted"
      borderRadius="xl"
      p={8}
      bg="bg.subtle"
      {...props}
    >
      <VStack gap={3}>
        {icon}
        <Text fontWeight="700" color="text.secondary" fontSize="md">
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

export default EmptyState;
