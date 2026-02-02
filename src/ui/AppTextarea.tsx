import React from "react";
import { Textarea } from "@chakra-ui/react";
import type { TextareaProps } from "@chakra-ui/react";

const AppTextarea: React.FC<TextareaProps> = (props) => {
  return (
    <Textarea
      bg="bg.panel"
      borderColor="border.muted"
      borderRadius="6px"
      px={3}
      py={2}
      fontSize="sm"
      color="text.primary"
      _placeholder={{ color: "text.muted", fontWeight: "400" }}
      _focusVisible={{
        borderColor: "blue.400",
        boxShadow: "0 0 0 1px #4299e1",
      }}
      {...props}
    />
  );
};

export default AppTextarea;
