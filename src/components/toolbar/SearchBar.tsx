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

  const handleFocus = () => {
    setIsFocused(true);
    if (typeof document !== "undefined") {
      document.body.classList.add("no-scroll");
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (typeof document !== "undefined") {
      document.body.classList.remove("no-scroll");
    }
  };

  return (
    <HStack
      gap={3}
      bg="bg.panel"
      borderRadius="xl"
      px={4}
      h="44px"
      border="1px solid"
      borderColor={
        isFocused ? "blue.400" : hasValue ? "blue.300" : "border.muted"
      }
      boxShadow={
        isFocused
          ? "0 0 0 2px rgba(59, 130, 246, 0.15)"
          : "0 8px 18px rgba(15, 23, 42, 0.04)"
      }
      align="center"
      transition="all 0.2s"
    >
      <Box
        w="28px"
        h="28px"
        borderRadius="full"
        bg={isFocused || hasValue ? "blue.50" : "bg.muted"}
        color={isFocused || hasValue ? "blue.600" : "text.muted"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition="all 0.2s"
      >
        <Box as={FiSearch} fontSize="14px" />
      </Box>
      <AppInput
        variant="flushed"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        bg="transparent"
        border="none"
        px={0}
        h="44px"
        fontSize={{ base: "16px", md: "sm" }}
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
