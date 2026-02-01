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
        px={3}
        fontSize="sm"
        color="gray.800"
        _focusVisible={{
          borderColor: "brand.400",
          boxShadow: "0 0 0 1px #5b85ff",
        }}
      >
        {children}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
};

export default AppSelect;
