import React from "react";
import { IconButton } from "@chakra-ui/react";
import type { IconButtonProps } from "@chakra-ui/react";

type Props = IconButtonProps;

const AppIconButton: React.FC<Props> = ({ children, ...props }) => {
  return (
    <IconButton
      variant="ghost"
      borderRadius="control"
      color="text.muted"
      _hover={{ bg: "bg.muted", color: "gray.900" }}
      {...props}
    >
      {children}
    </IconButton>
  );
};

export default AppIconButton;
