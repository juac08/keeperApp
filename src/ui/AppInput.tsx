import React from "react";
import { Input } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";

const AppInput: React.FC<InputProps> = (props) => {
  return (
    <Input
      bg="bg.panel"
      borderColor="border.muted"
      borderRadius="control"
      h="48px"
      px={4}
      fontSize="sm"
      color="text.primary"
      borderWidth={1}
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

export default AppInput;
