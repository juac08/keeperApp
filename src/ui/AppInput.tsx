import React from "react";
import { Input } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";

const AppInput: React.FC<InputProps> = (props) => {
  return (
    <Input
      bg="bg.panel"
      borderColor="border.muted"
      borderRadius="xl"
      h="48px"
      px={4}
      fontSize="sm"
      color="text.primary"
      borderWidth={1}
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

export default AppInput;
