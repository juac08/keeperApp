import React from "react";
import { Flex } from "@chakra-ui/react";
import { HeaderActions, ProjectInfo } from "@/components/header";

type Props = {
  onClear: () => void;
  onAdd: () => void;
  onCreateBoard: () => void;
};

const BoardHeader: React.FC<Props> = ({ onClear, onAdd, onCreateBoard }) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      direction={{ base: "column", md: "row" }}
      gap={6}
      mb={8}
    >
      <ProjectInfo />
      <HeaderActions
        onClear={onClear}
        onAdd={onAdd}
        onCreateBoard={onCreateBoard}
      />
    </Flex>
  );
};

export default BoardHeader;
