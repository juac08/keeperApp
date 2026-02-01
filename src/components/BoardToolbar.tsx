import React from "react";
import { Box, Grid } from "@chakra-ui/react";
import FilterButtons from "@/components/toolbar/FilterButtons";
import SearchBar from "@/components/toolbar/SearchBar";
import StatTiles from "@/components/toolbar/StatTiles";

type Props = {
  total: number;
  todo: number;
  inprogress: number;
  done: number;
};

const BoardToolbar: React.FC<Props> = ({ total, todo, inprogress, done }) => {
  return (
    <Box mb={8}>
      <Grid templateColumns={{ base: "1fr", lg: "1.4fr auto" }} gap={4} alignItems="center">
        <SearchBar />
        <FilterButtons />
      </Grid>
      <StatTiles total={total} todo={todo} inprogress={inprogress} done={done} />
    </Box>
  );
};

export default BoardToolbar;
