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
    bg: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
    _dark: {
      bg: "linear-gradient(180deg, #1b2434 0%, #151c2b 100%)",
      borderColor: "border.muted",
      boxShadow: "0 10px 18px rgba(0, 0, 0, 0.35)",
    },
    borderColor: "border.muted",
    boxShadow: "0 10px 18px rgba(15, 23, 42, 0.06)",
    labelColor: "text.muted",
    valueColor: "text.primary",
  },
  todo: {
    bg: "linear-gradient(180deg, #f0f7ff 0%, #e8f1ff 100%)",
    _dark: {
      bg: "linear-gradient(180deg, #162539 0%, #121c2b 100%)",
      borderColor: "rgba(59, 130, 246, 0.25)",
      boxShadow: "0 10px 18px rgba(15, 23, 42, 0.35)",
    },
    borderColor: "blue.100",
    boxShadow: "0 10px 18px rgba(37, 99, 235, 0.08)",
    labelColor: "blue.600",
    valueColor: "blue.700",
    _darkLabel: "blue.300",
    _darkValue: "blue.200",
  },
  inprogress: {
    bg: "linear-gradient(180deg, #f6f0ff 0%, #efe7ff 100%)",
    _dark: {
      bg: "linear-gradient(180deg, #201a33 0%, #171428 100%)",
      borderColor: "rgba(167, 139, 250, 0.25)",
      boxShadow: "0 10px 18px rgba(15, 23, 42, 0.35)",
    },
    borderColor: "purple.100",
    boxShadow: "0 10px 18px rgba(124, 58, 237, 0.08)",
    labelColor: "purple.600",
    valueColor: "purple.700",
    _darkLabel: "purple.300",
    _darkValue: "purple.200",
  },
  done: {
    bg: "linear-gradient(180deg, #ecfdf3 0%, #e3f9ee 100%)",
    _dark: {
      bg: "linear-gradient(180deg, #142a24 0%, #0f1f1a 100%)",
      borderColor: "rgba(52, 211, 153, 0.25)",
      boxShadow: "0 10px 18px rgba(15, 23, 42, 0.35)",
    },
    borderColor: "green.100",
    boxShadow: "0 10px 18px rgba(16, 185, 129, 0.08)",
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
      borderRadius="2xl"
      p={3.5}
      border="1px solid"
      bg={styles.bg}
      borderColor={styles.borderColor}
      boxShadow={styles.boxShadow}
      _dark={styles._dark}
    >
      <Box
        fontSize="xs"
        fontWeight="700"
        letterSpacing="0.08em"
        color={styles.labelColor}
        _dark={styles._darkLabel ? { color: styles._darkLabel } : undefined}
      >
        {label}
      </Box>
      <Box
        fontSize="2xl"
        fontWeight="800"
        mt={1}
        color={styles.valueColor}
        _dark={styles._darkValue ? { color: styles._darkValue } : undefined}
      >
        {value}
      </Box>
    </Box>
  );
};

export default StatTile;
