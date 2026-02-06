import React from "react";
import { Box } from "@chakra-ui/react";
import { HeaderActions, ProjectInfo } from "@/components/header";
import { HeaderCard } from "@/ui";

type Props = {
  onCreateBoard: () => void;
  onOpenArchive: () => void;
  onOpenExportImport: () => void;
  onOpenTemplates: () => void;
  onOpenMembers: () => void;
  onOpenOrganizationMembers: () => void;
  onDeleteBoard: () => void;
};

const BoardHeader: React.FC<Props> = ({
  onCreateBoard,
  onOpenArchive,
  onOpenExportImport,
  onOpenTemplates,
  onOpenMembers,
  onOpenOrganizationMembers,
  onDeleteBoard,
}) => {
  return (
    <HeaderCard
      mb={8}
      position="sticky"
      top={4}
      zIndex={100}
      backdropFilter="blur(12px)"
      backgroundColor="rgba(255, 255, 255, 0.92)"
      _dark={{ backgroundColor: "rgba(15, 23, 42, 0.92)" }}
    >
      <Box flex="1">
        <ProjectInfo />
      </Box>
      <HeaderActions
        onCreateBoard={onCreateBoard}
        onOpenArchive={onOpenArchive}
        onOpenExportImport={onOpenExportImport}
        onOpenTemplates={onOpenTemplates}
        onOpenMembers={onOpenMembers}
        onOpenOrganizationMembers={onOpenOrganizationMembers}
        onDeleteBoard={onDeleteBoard}
      />
    </HeaderCard>
  );
};

export default BoardHeader;
