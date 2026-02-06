import React from "react";
import { Textarea } from "@chakra-ui/react";
import type { TextareaProps } from "@chakra-ui/react";

const AppTextarea: React.FC<TextareaProps> = (props) => {
  return (
    <Textarea
      bg="bg.panel"
      borderColor="border.muted"
      borderRadius="control"
      px={4}
      py={3}
      fontSize="sm"
      color="text.primary"
      _placeholder={{ color: "text.muted", fontWeight: "400" }}
      _hover={{ borderColor: "blue.300" }}
      _focusVisible={{
        borderColor: "blue.500",
        boxShadow: "0 0 0 3px rgba(31, 134, 220, 0.2)",
      }}
      transition="all 0.18s ease"
      {...props}
    />
  );
};

export default AppTextarea;
