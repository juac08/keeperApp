import React from "react";
import { Input } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";

const AppInput: React.FC<InputProps> = (props) => {
  return (
    <Input
      bg="bg.panel"
      borderColor="border.muted"
      borderRadius="control"
      h="44px"
      px={3.5}
      fontSize="sm"
      color="text.primary"
      borderWidth={1}
      _placeholder={{ color: "text.muted", fontWeight: "400" }}
      _hover={{ borderColor: "blue.300" }}
      _focusVisible={{
        borderColor: "blue.500",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.12)",
      }}
      transition="all 0.15s ease"
      {...props}
    />
  );
};

export default AppInput;
