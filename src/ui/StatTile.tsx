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
  _dark?: {
    bg?: string;
    borderColor?: string;
    boxShadow?: string;
  };
  labelColor: string;
  valueColor: string;
  _darkLabel?: string;
  _darkValue?: string;
};

const variants: Record<Variant, StatTileVariant> = {
  neutral: {
    bg: "bg.muted",
    _dark: {
      bg: "bg.muted",
      borderColor: "border.muted",
      boxShadow: "none",
    },
    borderColor: "border.muted",
    boxShadow: "none",
    labelColor: "text.muted",
    valueColor: "text.primary",
  },
  todo: {
    bg: "linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)",
    _dark: {
      bg: "linear-gradient(180deg, #1e293b 0%, #172554 100%)",
      borderColor: "rgba(59, 130, 246, 0.2)",
      boxShadow: "none",
    },
    borderColor: "blue.100",
    boxShadow: "none",
    labelColor: "blue.600",
    valueColor: "blue.700",
    _darkLabel: "blue.300",
    _darkValue: "blue.200",
  },
  inprogress: {
    bg: "linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%)",
    _dark: {
      bg: "linear-gradient(180deg, #1e293b 0%, #1e1b4b 100%)",
      borderColor: "rgba(139, 92, 246, 0.2)",
      boxShadow: "none",
    },
    borderColor: "purple.100",
    boxShadow: "none",
    labelColor: "purple.600",
    valueColor: "purple.700",
    _darkLabel: "purple.300",
    _darkValue: "purple.200",
  },
  done: {
    bg: "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)",
    _dark: {
      bg: "linear-gradient(180deg, #1e293b 0%, #064e3b 100%)",
      borderColor: "rgba(16, 185, 129, 0.2)",
      boxShadow: "none",
    },
    borderColor: "green.100",
    boxShadow: "none",
    labelColor: "green.700",
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
      _dark={styles._dark}
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
