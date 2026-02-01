import React from "react";
import { Input } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";

const AppInput: React.FC<InputProps> = (props) => {
  return (
    <Input
      bg="bg.panel"
      borderColor="border.muted"
      borderRadius="control"
      h="40px"
      px={3}
      fontSize="sm"
      color="gray.800"
      _placeholder={{ color: "gray.400", fontWeight: "400" }}
      _focusVisible={{ borderColor: "brand.400", boxShadow: "0 0 0 1px #5b85ff" }}
      {...props}
    />
  );
};

export default AppInput;
