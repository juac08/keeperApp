import React from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FiCalendar, FiX } from "react-icons/fi";

type Props = {
  value?: string;
  onChange: (date: string | undefined) => void;
  label?: string;
  placeholder?: string;
};

const DatePicker: React.FC<Props> = ({
  value,
  onChange,
  label = "Due Date",
  placeholder = "Select date",
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = value && new Date(value) < new Date();
  const isDueToday =
    value && new Date(value).toDateString() === new Date().toDateString();
  const isDueSoon =
    value && new Date(value) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return (
    <Box>
      <HStack gap={2}>
        <Box position="relative" flex="1">
          <input
            type="date"
            value={value || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value || undefined)
            }
            style={{
              width: "100%",
              padding: "10px 14px",
              paddingLeft: "38px",
              borderRadius: "6px",
              border: `1px solid ${isOverdue ? "#fc8181" : isDueToday ? "#f6ad55" : "#cbd5e0"}`,
              backgroundColor: "white",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#4299e1";
              e.target.style.boxShadow = "0 0 0 1px #4299e1";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isOverdue
                ? "#fc8181"
                : isDueToday
                  ? "#f6ad55"
                  : "#cbd5e0";
              e.target.style.boxShadow = "none";
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLInputElement;
              if (document.activeElement !== target) {
                target.style.borderColor = "#a0aec0";
              }
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLInputElement;
              if (document.activeElement !== target) {
                target.style.borderColor = isOverdue
                  ? "#fc8181"
                  : isDueToday
                    ? "#f6ad55"
                    : "#cbd5e0";
              }
            }}
          />
          <Box
            position="absolute"
            left="3"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            color={
              isOverdue
                ? "red.500"
                : isDueToday
                  ? "orange.500"
                  : isDueSoon
                    ? "yellow.600"
                    : "gray.400"
            }
          >
            <FiCalendar size={16} />
          </Box>
        </Box>
        {value && (
          <Box
            as="button"
            onClick={() => onChange(undefined)}
            p={2}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
            bg="white"
            color="gray.600"
            _hover={{
              bg: "gray.50",
              borderColor: "gray.400",
              color: "gray.800",
            }}
            transition="all 0.2s"
            aria-label="Clear date"
          >
            <FiX size={16} />
          </Box>
        )}
      </HStack>
      {value && (
        <Text
          fontSize="xs"
          color={
            isOverdue
              ? "red.600"
              : isDueToday
                ? "orange.600"
                : isDueSoon
                  ? "yellow.700"
                  : "gray.500"
          }
          mt={1}
        >
          {isOverdue
            ? `Overdue by ${Math.ceil((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24))} days`
            : isDueToday
              ? "Due today"
              : isDueSoon
                ? `Due in ${Math.ceil((new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`
                : `Due ${formatDate(value)}`}
        </Text>
      )}
    </Box>
  );
};

export default DatePicker;
