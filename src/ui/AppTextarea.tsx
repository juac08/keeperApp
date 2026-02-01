import React from "react";
import { Textarea } from "@chakra-ui/react";
import type { TextareaProps } from "@chakra-ui/react";

const AppTextarea: React.FC<TextareaProps> = (props) => {
  return (
    <Textarea
      bg="bg.panel"
      borderColor="border.muted"
      borderRadius="control"
      px={3}
      py={2}
      fontSize="sm"
      color="gray.800"
      _placeholder={{ color: "gray.400", fontWeight: "400" }}
      _focusVisible={{
        borderColor: "brand.400",
        boxShadow: "0 0 0 1px #5b85ff",
      }}
      {...props}
    />
  );
};

export default AppTextarea;
