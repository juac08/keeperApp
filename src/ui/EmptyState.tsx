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
      border="2px dashed"
      borderColor="border.muted"
      borderRadius="2xl"
      p={10}
      bg="linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%)"
      _dark={{
        bg: "linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)",
        borderColor: "rgba(148, 163, 184, 0.4)",
      }}
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
