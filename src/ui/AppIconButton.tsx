import React from "react";
import { IconButton } from "@chakra-ui/react";
import type { IconButtonProps } from "@chakra-ui/react";

type Props = IconButtonProps;

const AppIconButton: React.FC<Props> = ({ children, ...props }) => {
  return (
    <IconButton
      variant="ghost"
      size="sm"
      w="36px"
      h="36px"
      minW="36px"
      borderRadius="control"
      color="text.secondary"
      _hover={{ bg: "bg.muted", color: "text.primary" }}
      _active={{ bg: "blue.500/10", color: "text.primary" }}
      transition="all 0.18s ease"
      {...props}
    >
      {children}
    </IconButton>
  );
};

export default AppIconButton;
