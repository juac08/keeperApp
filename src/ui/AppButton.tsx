import React from "react";
import { Button, HStack } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

type VariantStyle = "primary" | "outline" | "ghost" | "subtle";

type Props = ButtonProps & {
  icon?: React.ReactElement;
  variantStyle?: VariantStyle;
};

const AppButton: React.FC<Props> = ({ icon, children, variantStyle = "primary", size, h, px, ...props }) => {
  const variantMap: Record<VariantStyle, ButtonProps> = {
    primary: { variant: "solid", colorScheme: "blue" },
    outline: { variant: "outline", colorScheme: "gray", borderColor: "border.muted" },
    ghost: { variant: "ghost", colorScheme: "gray" },
    subtle: { variant: "subtle", colorScheme: "gray" },
  };

  const resolvedH = h ?? (size === "sm" ? "36px" : "40px");
  const resolvedPx = px ?? (size === "sm" ? 3 : 4);

  return (
    <Button
      borderRadius="control"
      fontWeight="600"
      boxShadow={variantStyle === "primary" ? "lift" : "none"}
      _hover={{ bg: variantStyle === "primary" ? "blue.600" : "bg.muted" }}
      {...variantMap[variantStyle]}
      h={resolvedH}
      px={resolvedPx}
      {...props}
    >
      {icon ? (
        <HStack gap={2}>
          {icon}
          <span>{children}</span>
        </HStack>
      ) : (
        children
      )}
    </Button>
  );
};

export default AppButton;
