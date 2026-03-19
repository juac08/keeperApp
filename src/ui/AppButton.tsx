import React from "react";
import { Button, HStack } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

type VariantStyle = "primary" | "outline" | "ghost" | "subtle";

type Props = ButtonProps & {
  icon?: React.ReactElement;
  variantStyle?: VariantStyle;
};

const AppButton: React.FC<Props> = ({
  icon,
  children,
  variantStyle = "primary",
  size,
  h,
  px,
  ...props
}) => {
  const variantMap: Record<VariantStyle, ButtonProps> = {
    primary: { variant: "solid", colorScheme: "brand" },
    outline: {
      variant: "outline",
      colorScheme: "gray",
      borderColor: "border.muted",
    },
    ghost: { variant: "ghost", colorScheme: "gray" },
    subtle: { variant: "subtle", colorScheme: "gray" },
  };

  const resolvedH = h ?? (size === "sm" ? "34px" : "38px");
  const resolvedPx = px ?? (size === "sm" ? 3.5 : 4);

  return (
    <Button
      borderRadius="control"
      fontWeight="600"
      fontSize="sm"
      letterSpacing="-0.01em"
      boxShadow={
        variantStyle === "primary" ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none"
      }
      _hover={{
        bg: variantStyle === "primary" ? "brand.600" : "bg.muted",
        boxShadow:
          variantStyle === "primary"
            ? "0 4px 12px rgba(59, 130, 246, 0.25)"
            : "none",
        transform: "translateY(-0.5px)",
      }}
      _active={{
        bg: variantStyle === "primary" ? "brand.700" : "bg.muted",
        transform: "translateY(0)",
      }}
      transition="all 0.15s ease"
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
