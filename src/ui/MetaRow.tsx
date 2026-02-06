import React from "react";
import { HStack } from "@chakra-ui/react";
import type { StackProps } from "@chakra-ui/react";

const MetaRow: React.FC<StackProps> = ({ children, ...props }) => {
  return (
    <HStack gap={2} align="center" flexWrap="wrap" {...props}>
      {children}
    </HStack>
  );
};

export default MetaRow;
