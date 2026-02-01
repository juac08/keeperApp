import React from "react";
import { HStack } from "@chakra-ui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { AppButton } from "@/ui";

type Props = {
  onClear: () => void;
  onAdd: () => void;
};

const HeaderActions: React.FC<Props> = ({ onClear, onAdd }) => {
  return (
    <HStack gap={3}>
      <AppButton variantStyle="outline" onClick={onClear} icon={<FiTrash2 />}>
        Clear board
      </AppButton>
      <AppButton variantStyle="primary" onClick={onAdd} icon={<FiPlus />}>
        Create task
      </AppButton>
    </HStack>
  );
};

export default HeaderActions;
