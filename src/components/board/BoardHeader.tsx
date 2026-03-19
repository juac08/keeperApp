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
      mb={6}
      position="sticky"
      top={4}
      zIndex={100}
      backdropFilter="blur(16px) saturate(180%)"
      backgroundColor="rgba(255, 255, 255, 0.85)"
      _dark={{ backgroundColor: "rgba(17, 24, 39, 0.85)" }}
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
