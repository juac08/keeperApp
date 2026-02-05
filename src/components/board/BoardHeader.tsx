import React from "react";
import { Flex } from "@chakra-ui/react";
import { HeaderActions, ProjectInfo } from "@/components/header";

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
    <Flex
      align="center"
      justify="space-between"
      direction={{ base: "column", lg: "row" }}
      gap={{ base: 4, md: 6 }}
      mb={8}
      px={{ base: 5, md: 7 }}
      py={{ base: 4, md: 5 }}
      bg="bg.panel"
      borderRadius="2xl"
      border="1px solid"
      borderColor="border.muted"
      boxShadow="0 18px 40px rgba(15, 23, 42, 0.08)"
      position="sticky"
      top={4}
      zIndex={100}
      backdropFilter="blur(12px)"
      backgroundColor="rgba(255, 255, 255, 0.92)"
      _dark={{
        backgroundColor: "rgba(15, 23, 42, 0.92)",
      }}
    >
      <ProjectInfo />
      <HeaderActions
        onCreateBoard={onCreateBoard}
        onOpenArchive={onOpenArchive}
        onOpenExportImport={onOpenExportImport}
        onOpenTemplates={onOpenTemplates}
        onOpenMembers={onOpenMembers}
        onOpenOrganizationMembers={onOpenOrganizationMembers}
        onDeleteBoard={onDeleteBoard}
      />
    </Flex>
  );
};

export default BoardHeader;
