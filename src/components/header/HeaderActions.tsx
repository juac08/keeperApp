import React from "react";
import { HStack } from "@chakra-ui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { AppButton } from "@/ui";
import BoardSelector from "@/components/board/BoardSelector";

type Props = {
  onClear: () => void;
  onAdd: () => void;
  onCreateBoard: () => void;
};

const HeaderActions: React.FC<Props> = ({ onClear, onAdd, onCreateBoard }) => {
  return (
    <HStack gap={3}>
      <BoardSelector onCreateBoard={onCreateBoard} />
      <AppButton variantStyle="outline" onClick={onClear} icon={<FiTrash2 />}>
        Clear board
      </AppButton>
      <AppButton variantStyle="primary" onClick={onAdd}>
        ✨ Create task
      </AppButton>
    </HStack>
  );
};

export default HeaderActions;
