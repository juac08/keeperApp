import React from "react";
import { HStack } from "@chakra-ui/react";
import { FiAlertCircle, FiFilter } from "react-icons/fi";
import { AppButton } from "@/ui";

const FilterButtons: React.FC = () => {
  return (
    <HStack gap={3} justify={{ base: "flex-start", lg: "center" }}>
      <AppButton
        size="sm"
        h="40px"
        px={4}
        variantStyle="outline"
        icon={<FiFilter />}
      >
        Priority
      </AppButton>
      <AppButton
        size="sm"
        h="40px"
        px={4}
        variantStyle="outline"
        icon={<FiAlertCircle />}
      >
        Blocked
      </AppButton>
    </HStack>
  );
};

export default FilterButtons;
