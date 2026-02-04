import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import {
  FiSettings,
  FiChevronDown,
  FiDownload,
  FiArchive,
  FiTrash2,
  FiCopy,
  FiSun,
  FiMoon,
  FiLayers,
  FiUsers,
  FiShield,
} from "react-icons/fi";
import { AppIconButton } from "@/ui";
import { useThemeStore } from "@/state/ThemeStore";
import { useDensityStore } from "@/state/DensityStore";
import { useGetMeQuery } from "@/store";

type Props = {
  onClear: () => void;
  onOpenArchive: () => void;
  onOpenExportImport: () => void;
  onOpenTemplates: () => void;
  onOpenMembers: () => void;
  onOpenOrganizationMembers: () => void;
  onDeleteBoard: () => void;
};

export const SettingsDropdown: React.FC<Props> = ({
  onClear,
  onOpenArchive,
  onOpenExportImport,
  onOpenTemplates,
  onOpenMembers,
  onOpenOrganizationMembers,
  onDeleteBoard,
}) => {
  const { colorMode, toggleColorMode } = useThemeStore();
  const { density, setDensity } = useDensityStore();
  const { data: user } = useGetMeQuery();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const canManageOrganization = user?.isSuperAdmin;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const densityLabels = {
    compact: "Compact",
    comfortable: "Comfortable",
    spacious: "Spacious",
  };

  const cycleDensity = () => {
    const modes = ["compact", "comfortable", "spacious"] as const;
    const currentIndex = modes.indexOf(density);
    const nextIndex = (currentIndex + 1) % modes.length;
    setDensity(modes[nextIndex]);
  };

  const menuItems = [
    ...(canManageOrganization
      ? [
          {
            icon: <FiShield size={16} />,
            label: "Organization Members",
            onClick: () => {
              onOpenOrganizationMembers();
              setIsOpen(false);
            },
          },
        ]
      : []),
    {
      icon: <FiUsers size={16} />,
      label: "Board Members",
      onClick: () => {
        onOpenMembers();
        setIsOpen(false);
      },
    },
    {
      icon: <FiDownload size={16} />,
      label: "Export/Import",
      onClick: () => {
        onOpenExportImport();
        setIsOpen(false);
      },
    },
    {
      icon: <FiArchive size={16} />,
      label: "Archive",
      onClick: () => {
        onOpenArchive();
        setIsOpen(false);
      },
    },
    {
      icon: <FiCopy size={16} />,
      label: "Templates",
      onClick: () => {
        onOpenTemplates();
        setIsOpen(false);
      },
    },
    {
      icon: <FiLayers size={16} />,
      label: `Density: ${densityLabels[density]}`,
      onClick: () => {
        cycleDensity();
      },
    },
    {
      icon: colorMode === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />,
      label: colorMode === "dark" ? "Light mode" : "Dark mode",
      onClick: () => {
        toggleColorMode();
      },
    },
    {
      icon: <FiTrash2 size={16} />,
      label: "Clear board",
      onClick: () => {
        onClear();
        setIsOpen(false);
      },
      color: "red.600",
    },
    {
      icon: <FiTrash2 size={16} />,
      label: "Delete board",
      onClick: () => {
        onDeleteBoard();
        setIsOpen(false);
      },
      color: "red.700",
    },
  ];

  return (
    <Box position="relative" ref={dropdownRef}>
      <AppIconButton
        aria-label="Settings"
        onClick={() => setIsOpen(!isOpen)}
        size="md"
      >
        <FiSettings size={18} />
      </AppIconButton>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          right="0"
          bg="bg.panel"
          border="1px solid"
          borderColor="border.muted"
          borderRadius="lg"
          boxShadow="lg"
          zIndex={1000}
          minW="200px"
          overflow="hidden"
        >
          {menuItems.map((item, index) => (
            <Box
              key={index}
              px={4}
              py={2.5}
              cursor="pointer"
              bg="bg.panel"
              color={item.color || "text.primary"}
              fontSize="sm"
              transition="all 0.15s"
              _hover={{
                bg: "bg.muted",
              }}
              onClick={item.onClick}
            >
              <HStack gap={3}>
                {item.icon}
                <Text>{item.label}</Text>
              </HStack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
