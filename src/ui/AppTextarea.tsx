import React from "react";
import { Textarea } from "@chakra-ui/react";
import type { TextareaProps } from "@chakra-ui/react";

const AppTextarea: React.FC<TextareaProps> = (props) => {
  return (
    <Textarea
      bg="bg.panel"
      borderColor="border.muted"
      borderRadius="xl"
      px={4}
      py={3}
      fontSize="sm"
      color="text.primary"
      _placeholder={{ color: "text.muted", fontWeight: "400" }}
      _hover={{ borderColor: "blue.200" }}
      _focusVisible={{
        borderColor: "blue.400",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.15)",
      }}
      {...props}
    />
  );
};

export default AppTextarea;
