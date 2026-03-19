import React from "react";
import { Box } from "@chakra-ui/react";

type Variant = "neutral" | "todo" | "inprogress" | "done";

type Props = {
  label: string;
  value: number;
  variant?: Variant;
};

type StatTileVariant = {
  bg: string;
  borderColor: string;
  boxShadow: string;
  labelColor: string;
  valueColor: string;
  _dark?: {
    bg?: string;
    borderColor?: string;
  };
  _darkLabel?: string;
  _darkValue?: string;
};

const variants: Record<Variant, StatTileVariant> = {
  neutral: {
    bg: "bg.muted",
    borderColor: "border.muted",
    boxShadow: "none",
    labelColor: "text.muted",
    valueColor: "text.primary",
  },
  todo: {
    bg: "blue.500/8",
    borderColor: "blue.500/20",
    boxShadow: "none",
    labelColor: "blue.600",
    valueColor: "blue.700",
    _darkLabel: "blue.300",
    _darkValue: "blue.200",
  },
  inprogress: {
    bg: "purple.500/8",
    borderColor: "purple.500/20",
    boxShadow: "none",
    labelColor: "purple.600",
    valueColor: "purple.700",
    _darkLabel: "purple.300",
    _darkValue: "purple.200",
  },
  done: {
    bg: "green.500/8",
    borderColor: "green.500/20",
    boxShadow: "none",
    labelColor: "green.600",
    valueColor: "green.700",
    _darkLabel: "green.300",
    _darkValue: "green.200",
  },
};

const StatTile: React.FC<Props> = ({ label, value, variant = "neutral" }) => {
  const styles: any = variants[variant];

  return (
    <Box
      borderRadius="xl"
      p={3}
      border="1px solid"
      bg={styles.bg}
      borderColor={styles.borderColor}
      boxShadow={styles.boxShadow}
    >
      <Box
        fontSize="xs"
        fontWeight="600"
        letterSpacing="0.04em"
        color={styles.labelColor}
        _dark={styles._darkLabel ? { color: styles._darkLabel } : undefined}
      >
        {label}
      </Box>
      <Box
        fontSize="xl"
        fontWeight="700"
        mt={0.5}
        color={styles.valueColor}
        _dark={styles._darkValue ? { color: styles._darkValue } : undefined}
      >
        {value}
      </Box>
    </Box>
  );
};

export default StatTile;
