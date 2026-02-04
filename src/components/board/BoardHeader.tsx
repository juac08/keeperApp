import React from "react";
import { Flex } from "@chakra-ui/react";
import { HeaderActions, ProjectInfo } from "@/components/header";

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

const BoardHeader: React.FC<Props> = ({
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
    <Flex
      align="center"
      justify="space-between"
      direction={{ base: "column", md: "row" }}
      gap={6}
      mb={8}
      p={4}
      bg="bg.panel"
      borderRadius="xl"
      border="1px solid"
      borderColor="border.muted"
      boxShadow="sm"
      position="sticky"
      top={4}
      zIndex={100}
      backdropFilter="blur(10px)"
      backgroundColor="rgba(255, 255, 255, 0.95)"
      _dark={{
        backgroundColor: "rgba(26, 32, 44, 0.95)",
      }}
    >
      <ProjectInfo />
      <HeaderActions
        onClear={onClear}
        onCreateBoard={onCreateBoard}
        onDeleteBoard={onDeleteBoard}
        onOpenArchive={onOpenArchive}
        onOpenExportImport={onOpenExportImport}
        onOpenTemplates={onOpenTemplates}
        onOpenMembers={onOpenMembers}
        onOpenOrganizationMembers={onOpenOrganizationMembers}
      />
    </Flex>
  );
};

export default BoardHeader;
