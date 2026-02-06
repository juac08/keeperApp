import React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import { StatTile } from "@/ui";

type Props = {
  total: number;
  todo: number;
  inprogress: number;
  done: number;
};

const StatTiles: React.FC<Props> = ({ total, todo, inprogress, done }) => {
  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mt={3}>
      <StatTile label="TOTAL" value={total} variant="neutral" />
      <StatTile label="TO DO" value={todo} variant="todo" />
      <StatTile label="IN PROGRESS" value={inprogress} variant="inprogress" />
      <StatTile label="DONE" value={done} variant="done" />
    </SimpleGrid>
  );
};

export default StatTiles;
