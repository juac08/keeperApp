import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { AppInput } from "@/ui";

const SearchBar: React.FC = () => {
  return (
    <HStack
      gap={3}
      bg="bg.panel"
      borderRadius="control"
      px={4}
      h="40px"
      border="1px solid"
      borderColor="border.muted"
      boxShadow="none"
      align="center"
    >
      <Box color="text.muted" display="grid" placeItems="center">
        <FiSearch />
      </Box>
      <AppInput
        variant="flushed"
        placeholder="Search tasks, tags, or owners"
        bg="transparent"
        border="none"
        px={0}
        h="40px"
        fontSize="sm"
        color="gray.700"
        _focusVisible={{ boxShadow: "none" }}
        _placeholder={{ color: "gray.400", fontWeight: "400" }}
      />
    </HStack>
  );
};

export default SearchBar;
