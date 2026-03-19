import React from "react";
import { NativeSelect } from "@chakra-ui/react";
import type { NativeSelectRootProps } from "@chakra-ui/react";

type Props = {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  rootProps?: NativeSelectRootProps;
};

const AppSelect: React.FC<Props> = ({
  name,
  value,
  onChange,
  children,
  rootProps,
}) => {
  return (
    <NativeSelect.Root size="md" {...rootProps}>
      <NativeSelect.Field
        name={name}
        value={value}
        onChange={onChange}
        bg="bg.panel"
        borderColor="border.muted"
        borderRadius="control"
        h="40px"
        px={3.5}
        fontSize="sm"
        color="text.primary"
        minW="160px"
        w="full"
        boxShadow="none"
        _hover={{ borderColor: "blue.300" }}
        _focusVisible={{
          borderColor: "brand.500",
          boxShadow: "none",
          outline: "none",
        }}
        _focus={{ outline: "none", boxShadow: "none" }}
        transition="all 0.15s ease"
        css={{
          "& option": {
            background: "var(--chakra-colors-bg\\.panel)",
            color: "var(--chakra-colors-text\\.primary)",
          },
        }}
      >
        {children}
      </NativeSelect.Field>
      <NativeSelect.Indicator color="text.muted" />
    </NativeSelect.Root>
  );
};

export default AppSelect;
