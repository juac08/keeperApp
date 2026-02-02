import React from "react";
import { Input } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";

const AppInput: React.FC<InputProps> = (props) => {
  return (
    <Input
      bg="bg.panel"
      borderColor="border.muted"
      borderRadius="6px"
      h="40px"
      px={3}
      fontSize="sm"
      color="text.primary"
      borderWidth={1}
      _placeholder={{ color: "text.muted", fontWeight: "400" }}
      _focusVisible={{
        borderColor: "blue.400",
        boxShadow: "0 0 0 1px #4299e1",
      }}
      {...props}
    />
  );
};

export default AppInput;
