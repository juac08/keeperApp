import React from "react";
import { Flex } from "@chakra-ui/react";
import HeaderActions from "@/components/header/HeaderActions";
import ProjectInfo from "@/components/header/ProjectInfo";

type Props = {
  onClear: () => void;
  onAdd: () => void;
};

const BoardHeader: React.FC<Props> = ({ onClear, onAdd }) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      direction={{ base: "column", md: "row" }}
      gap={6}
      mb={8}
    >
      <ProjectInfo />
      <HeaderActions onClear={onClear} onAdd={onAdd} />
    </Flex>
  );
};

export default BoardHeader;
