import React from "react";
import { Textarea } from "@chakra-ui/react";
import type { TextareaProps } from "@chakra-ui/react";

const AppTextarea: React.FC<TextareaProps> = (props) => {
  return (
    <Textarea
      bg="bg.panel"
      borderColor="border.muted"
      borderRadius="control"
      px={3.5}
      py={3}
      fontSize="sm"
      color="text.primary"
      _placeholder={{ color: "text.muted", fontWeight: "400" }}
      _hover={{ borderColor: "blue.300" }}
      _focusVisible={{
        borderColor: "blue.500",
        boxShadow: "none",
        outline: "none",
      }}
      _focus={{ outline: "none", boxShadow: "none" }}
      transition="all 0.15s ease"
      {...props}
    />
  );
};

export default AppTextarea;
