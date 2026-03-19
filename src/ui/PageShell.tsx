import React from "react";
import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

type Props = BoxProps & {
  withGradient?: boolean;
};

const PageShell: React.FC<Props> = ({
  children,
  withGradient = true,
  ...props
}) => {
  return (
    <Box
      minH="100vh"
      w="full"
      bg="bg.canvas"
      position="relative"
      overflow="hidden"
      {...props}
    >
      {withGradient && (
        <Box
          position="absolute"
          inset={0}
          bgGradient="radial(circle at 0% 0%, rgba(59, 130, 246, 0.06), transparent 50%), radial(circle at 100% 0%, rgba(99, 102, 241, 0.04), transparent 50%)"
        />
      )}
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
};

export default PageShell;
