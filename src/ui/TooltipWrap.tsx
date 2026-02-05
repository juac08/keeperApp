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
      bg="white"
      color="gray.800"
      px={3}
      py={1.5}
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="0 10px 24px rgba(15, 23, 42, 0.12)"
      fontSize="xs"
      fontWeight="600"
      whiteSpace="nowrap"
      opacity={0}
      pointerEvents="none"
      transition="all 0.03s ease"
      zIndex={2000}
    >
      {label}
    </Box>
  </Box>
);

export default TooltipWrap;
