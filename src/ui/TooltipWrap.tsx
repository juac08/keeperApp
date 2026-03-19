import React from "react";
import { Box } from "@chakra-ui/react";

type Props = {
  label: string;
  children: React.ReactNode;
};

const TooltipWrap: React.FC<Props> = ({ label, children }) => (
  <Box
    position="relative"
    _hover={{
      "& .app-tooltip": {
        opacity: 1,
        transform: "translateX(-50%) translateY(-2px)",
      },
    }}
    _focusWithin={{
      "& .app-tooltip": {
        opacity: 1,
        transform: "translateX(-50%) translateY(-2px)",
      },
    }}
  >
    {children}
    <Box
      className="app-tooltip"
      position="absolute"
      bottom="calc(100% + 8px)"
      left="50%"
      transform="translateX(-50%)"
      bg="bg.panel"
      color="text.primary"
      px={2.5}
      py={1}
      borderRadius="md"
      border="1px solid"
      borderColor="border.muted"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
      fontSize="xs"
      fontWeight="500"
      whiteSpace="nowrap"
      opacity={0}
      pointerEvents="none"
      transition="all 0.1s ease"
      zIndex={2000}
    >
      {label}
    </Box>
  </Box>
);

export default TooltipWrap;
