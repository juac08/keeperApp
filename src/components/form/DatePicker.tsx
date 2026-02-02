import React from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FiCalendar, FiX } from "react-icons/fi";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const selectedDate = value ? new Date(value) : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange(date.toISOString().split("T")[0]);
    } else {
      onChange(undefined);
    }
  };

  const isOverdue = value && new Date(value) < new Date();
  const isDueToday =
    value && new Date(value).toDateString() === new Date().toDateString();
  const isDueSoon =
    value && new Date(value) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return (
    <Box>
      <HStack gap={2}>
        <Box position="relative" flex="1" className="custom-datepicker-wrapper">
          <style>
            {`
              .custom-datepicker-wrapper .react-datepicker-wrapper {
                width: 100%;
              }
              .custom-datepicker-wrapper input {
                width: 100%;
                padding: 10px 14px;
                padding-left: 38px;
                border-radius: 6px;
                border: 1px solid ${isOverdue ? "#fc8181" : isDueToday ? "#f6ad55" : "#cbd5e0"};
                background-color: var(--chakra-colors-bg-panel);
                color: var(--chakra-colors-text-primary);
                font-size: 14px;
                outline: none;
                transition: all 0.2s;
              }
              .custom-datepicker-wrapper input:hover {
                border-color: #a0aec0;
              }
              .custom-datepicker-wrapper input:focus {
                border-color: #4299e1;
                box-shadow: 0 0 0 1px #4299e1;
              }
              .react-datepicker {
                font-family: inherit;
                background-color: var(--chakra-colors-bg-panel);
                border: 1px solid var(--chakra-colors-border-muted);
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
              }
              .react-datepicker__header {
                background-color: var(--chakra-colors-bg-muted);
                border-bottom: 1px solid var(--chakra-colors-border-muted);
                border-radius: 8px 8px 0 0;
                padding-top: 8px;
              }
              .react-datepicker__current-month {
                font-size: 14px;
                font-weight: 600;
                color: var(--chakra-colors-text-primary);
              }
              .react-datepicker__day-name {
                color: var(--chakra-colors-text-secondary);
                font-size: 12px;
                font-weight: 600;
              }
              .react-datepicker__day {
                color: var(--chakra-colors-text-primary);
                border-radius: 4px;
              }
              .react-datepicker__day:hover {
                background-color: var(--chakra-colors-bg-muted);
              }
              .react-datepicker__day--selected {
                background-color: #4299e1;
                color: white;
              }
              .react-datepicker__day--keyboard-selected {
                background-color: #bee3f8;
                color: var(--chakra-colors-text-primary);
              }
              .react-datepicker__day--today {
                font-weight: 600;
                color: #4299e1;
              }
              .react-datepicker__navigation-icon::before {
                border-color: var(--chakra-colors-text-primary);
              }
              .react-datepicker__month-text,
              .react-datepicker__year-text {
                color: var(--chakra-colors-text-primary);
              }
            `}
          </style>
          <ReactDatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMM d, yyyy"
            placeholderText={placeholder}
            minDate={new Date()}
            showPopperArrow={false}
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
            borderColor="border.muted"
            bg="bg.panel"
            color="text.secondary"
            _hover={{
              bg: "bg.muted",
              borderColor: "text.muted",
              color: "text.primary",
            }}
            transition="all 0.2s"
            aria-label="Clear date"
          >
            <FiX size={16} />
          </Box>
        )}
      </HStack>
      {value && (isOverdue || isDueToday || isDueSoon) && (
        <Text
          fontSize="xs"
          color={
            isOverdue ? "red.600" : isDueToday ? "orange.600" : "yellow.700"
          }
          mt={1}
        >
          {isOverdue
            ? `Overdue by ${Math.ceil((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24))} days`
            : isDueToday
              ? "Due today"
              : `Due in ${Math.ceil((new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`}
        </Text>
      )}
    </Box>
  );
};

export default DatePicker;
