import React, { useState, useRef, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { FiAlertCircle, FiFilter } from "react-icons/fi";
import { AppButton } from "@/ui";
import PriorityFilter from "./PriorityFilter";
import type { Priority } from "@/types";
import type { FilterType } from "@/hooks/useCardFilters";

type Props = {
  activeFilter: FilterType;
  priorityFilter: Priority | null;
  onFilterChange: (filter: FilterType) => void;
  onPriorityChange: (priority: Priority) => void;
};

const FilterButtons: React.FC<Props> = ({
  activeFilter,
  priorityFilter,
  onFilterChange,
  onPriorityChange,
}) => {
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowPriorityDropdown(false);
      }
    };

    if (showPriorityDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPriorityDropdown]);

  const handlePriorityClick = () => {
    setShowPriorityDropdown(!showPriorityDropdown);
  };

  const handlePrioritySelect = (priority: Priority) => {
    onPriorityChange(priority);
    setShowPriorityDropdown(false);
  };

  return (
    <HStack gap={3} justify={{ base: "flex-start", lg: "center" }}>
      <Box position="relative" ref={dropdownRef}>
        <AppButton
          size="sm"
          h="44px"
          px={5}
          borderRadius="full"
          variantStyle={activeFilter === "priority" ? "primary" : "outline"}
          icon={<FiFilter />}
          onClick={handlePriorityClick}
        >
          Priority{priorityFilter && `: ${priorityFilter}`}
        </AppButton>
        {showPriorityDropdown && (
          <PriorityFilter
            selected={priorityFilter}
            onSelect={handlePrioritySelect}
          />
        )}
      </Box>
      <AppButton
        size="sm"
        h="44px"
        px={5}
        borderRadius="full"
        variantStyle={activeFilter === "blocked" ? "primary" : "outline"}
        icon={<FiAlertCircle />}
        onClick={() => onFilterChange("blocked")}
      >
        Blocked
      </AppButton>
    </HStack>
  );
};

export default FilterButtons;
