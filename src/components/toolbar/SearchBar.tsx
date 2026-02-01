import React from "react";
import { Box, HStack, IconButton } from "@chakra-ui/react";
import { FiSearch, FiX } from "react-icons/fi";
import { AppInput } from "@/ui";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Search tasks, tags, or owners",
}) => {
  const hasValue = value.trim().length > 0;

  return (
    <HStack
      gap={3}
      bg="bg.panel"
      borderRadius="control"
      px={4}
      h="40px"
      border="1px solid"
      borderColor={hasValue ? "blue.400" : "border.muted"}
      boxShadow={hasValue ? "0 0 0 1px var(--chakra-colors-blue-400)" : "none"}
      align="center"
      transition="all 0.2s"
    >
      <Box
        color={hasValue ? "blue.500" : "text.muted"}
        display="flex"
        alignItems="center"
        transition="color 0.2s"
      >
        <Box as={FiSearch} fontSize="16px" />
      </Box>
      <AppInput
        variant="flushed"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        bg="transparent"
        border="none"
        px={0}
        h="40px"
        fontSize="sm"
        color="gray.700"
        _focusVisible={{ boxShadow: "none" }}
        _placeholder={{ color: "gray.400", fontWeight: "400" }}
      />
      {hasValue && (
        <IconButton
          aria-label="Clear search"
          size="xs"
          variant="ghost"
          onClick={() => onChange("")}
          color="gray.500"
          _hover={{ color: "gray.700", bg: "gray.100" }}
          borderRadius="full"
        >
          <FiX size={16} />
        </IconButton>
      )}
    </HStack>
  );
};

export default SearchBar;
