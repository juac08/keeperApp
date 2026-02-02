import React from "react";
import { HStack, IconButton } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import BoardSelector from "@/components/board/BoardSelector";
import { SettingsDropdown } from "./SettingsDropdown";

type Props = {
  onClear: () => void;
  onAdd: () => void;
  onCreateBoard: () => void;
  onOpenArchive: () => void;
  onOpenExportImport: () => void;
  onOpenTemplates: () => void;
};

const HeaderActions: React.FC<Props> = ({
  onClear,
  onAdd,
  onCreateBoard,
  onOpenArchive,
  onOpenExportImport,
  onOpenTemplates,
}) => {
  return (
    <HStack gap={3}>
      <BoardSelector onCreateBoard={onCreateBoard} />
      <IconButton
        aria-label="Create task"
        onClick={onAdd}
        bg="blue.500"
        color="white"
        size="md"
        borderRadius="lg"
        _hover={{ bg: "blue.600" }}
        _active={{ bg: "blue.700" }}
      >
        <FiPlus size={20} />
      </IconButton>
      <SettingsDropdown
        onClear={onClear}
        onOpenArchive={onOpenArchive}
        onOpenExportImport={onOpenExportImport}
        onOpenTemplates={onOpenTemplates}
      />
    </HStack>
  );
};

export default HeaderActions;
