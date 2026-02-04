import React from "react";
import { HStack, IconButton } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import BoardSelector from "@/components/board/BoardSelector";
import { SettingsDropdown } from "./SettingsDropdown";
import UserDropdown from "./UserDropdown";

type Props = {
  onClear: () => void;
  onCreateBoard: () => void;
  onOpenArchive: () => void;
  onOpenExportImport: () => void;
  onOpenTemplates: () => void;
  onOpenMembers: () => void;
  onOpenOrganizationMembers: () => void;
  onDeleteBoard: () => void;
};

const HeaderActions: React.FC<Props> = ({
  onClear,
  onCreateBoard,
  onOpenArchive,
  onOpenExportImport,
  onOpenTemplates,
  onOpenMembers,
  onOpenOrganizationMembers,
  onDeleteBoard,
}) => {
  return (
    <HStack gap={2.5}>
      <BoardSelector onCreateBoard={onCreateBoard} />
      <UserDropdown />
      <SettingsDropdown
        onClear={onClear}
        onOpenArchive={onOpenArchive}
        onOpenExportImport={onOpenExportImport}
        onOpenTemplates={onOpenTemplates}
        onOpenMembers={onOpenMembers}
        onOpenOrganizationMembers={onOpenOrganizationMembers}
        onDeleteBoard={onDeleteBoard}
      />
    </HStack>
  );
};

export default HeaderActions;
