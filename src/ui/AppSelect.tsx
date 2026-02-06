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
        h="48px"
        px={4}
        fontSize="sm"
        color="text.primary"
        minW="160px"
        w="full"
        _hover={{ borderColor: "blue.300" }}
        _focusVisible={{
          borderColor: "brand.500",
          boxShadow: "0 0 0 3px rgba(31, 134, 220, 0.2)",
        }}
        transition="all 0.18s ease"
      >
        {children}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
};

export default AppSelect;
