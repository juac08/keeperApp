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
          bgGradient="radial(circle at 10% 15%, rgba(31, 134, 220, 0.18), transparent 45%), radial(circle at 90% 25%, rgba(114, 187, 255, 0.18), transparent 40%), radial(circle at 55% 85%, rgba(31, 134, 220, 0.12), transparent 50%)"
        />
      )}
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
};

export default PageShell;
