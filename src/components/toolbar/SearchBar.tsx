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
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <HStack
      gap={3}
      bg="bg.panel"
      borderRadius="6px"
      px={4}
      h="40px"
      border="1px solid"
      borderColor={
        isFocused ? "blue.400" : hasValue ? "blue.400" : "border.muted"
      }
      boxShadow={isFocused ? "0 0 0 1px #4299e1" : "none"}
      align="center"
      transition="all 0.2s"
    >
      <Box
        color={isFocused || hasValue ? "blue.500" : "text.muted"}
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        bg="transparent"
        border="none"
        px={0}
        h="40px"
        fontSize="sm"
        color="text.primary"
        _focusVisible={{ boxShadow: "none" }}
        _placeholder={{ color: "text.muted", fontWeight: "400" }}
      />
      {hasValue && (
        <IconButton
          aria-label="Clear search"
          size="xs"
          variant="ghost"
          onClick={() => onChange("")}
          color="text.muted"
          _hover={{ color: "text.primary", bg: "bg.muted" }}
          borderRadius="full"
        >
          <FiX size={16} />
        </IconButton>
      )}
    </HStack>
  );
};

export default SearchBar;
