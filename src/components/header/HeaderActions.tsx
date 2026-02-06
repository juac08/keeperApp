import React, { useEffect, useRef, useState } from "react";
import { HStack, Box, Text } from "@chakra-ui/react";
import {
  FiArchive,
  FiDownload,
  FiLogOut,
  FiMoreVertical,
  FiPlus,
  FiShield,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import BoardSelector from "@/components/board/BoardSelector";
import UserDropdown from "./UserDropdown";
import { AppIconButton, TooltipWrap } from "@/ui";
import { useGetMeQuery, useLogoutMutation } from "@/store";
import { ThemeToggle } from "./ThemeToggle";
import { DensityToggle } from "./DensityToggle";
import { appToaster } from "@/shared";

type Props = {
  onCreateBoard: () => void;
  onOpenArchive: () => void;
  onOpenExportImport: () => void;
  onOpenTemplates: () => void;
  onOpenMembers: () => void;
  onOpenOrganizationMembers: () => void;
  onDeleteBoard: () => void;
};

const HeaderActions: React.FC<Props> = ({
  onCreateBoard,
  onOpenArchive,
  onOpenExportImport,
  onOpenTemplates,
  onOpenMembers,
  onOpenOrganizationMembers,
  onDeleteBoard,
}) => {
  const { data: user } = useGetMeQuery();
  const [logout] = useLogoutMutation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      appToaster.success({ title: "Logged out" });
      window.dispatchEvent(new Event("auth:logout"));
    } catch (error: any) {
      appToaster.error({
        title: "Logout failed",
        description: error?.data?.error || error?.message || "Please try again",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <HStack gap={2.5} wrap="wrap" justify={{ base: "center", md: "flex-end" }}>
      <BoardSelector onCreateBoard={onCreateBoard} />
      <HStack
        gap={1}
        px={2}
        py={1}
        borderRadius="full"
        border="1px solid"
        borderColor="border.muted"
        bg="bg.panel"
        align="center"
        overflow="visible"
      >
        <TooltipWrap label="Add task">
          <AppIconButton aria-label="Add task" onClick={onOpenTemplates}>
            <Box as={FiPlus} fontSize="16px" />
          </AppIconButton>
        </TooltipWrap>
        <TooltipWrap label="Board members">
          <AppIconButton aria-label="Board members" onClick={onOpenMembers}>
            <Box as={FiUsers} fontSize="16px" />
          </AppIconButton>
        </TooltipWrap>
        {user?.isSuperAdmin && (
          <TooltipWrap label="Organization members">
            <AppIconButton
              aria-label="Organization members"
              onClick={onOpenOrganizationMembers}
            >
              <Box as={FiShield} fontSize="16px" />
            </AppIconButton>
          </TooltipWrap>
        )}
        <TooltipWrap label="Archive">
          <AppIconButton aria-label="Archive" onClick={onOpenArchive}>
            <Box as={FiArchive} fontSize="16px" />
          </AppIconButton>
        </TooltipWrap>
        <TooltipWrap label="Export / Import">
          <AppIconButton
            aria-label="Export / Import"
            onClick={onOpenExportImport}
          >
            <Box as={FiDownload} fontSize="16px" />
          </AppIconButton>
        </TooltipWrap>
        <TooltipWrap label="Density">
          <Box>
            <DensityToggle />
          </Box>
        </TooltipWrap>
        <TooltipWrap label="Theme">
          <Box>
            <ThemeToggle />
          </Box>
        </TooltipWrap>
        <Box w="1px" h="24px" bg="border.muted" mx={1} />
        <Box position="relative" ref={menuRef}>
          <TooltipWrap label="More options">
            <AppIconButton
              aria-label="More options"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <Box as={FiMoreVertical} fontSize="16px" />
            </AppIconButton>
          </TooltipWrap>
          {isMenuOpen && (
            <Box
              position="absolute"
              top="calc(100% + 6px)"
              right="0"
              bg="bg.panel"
              border="1px solid"
              borderColor="border.muted"
              borderRadius="lg"
              boxShadow="lg"
              minW="180px"
              zIndex={1000}
              overflow="hidden"
            >
              <Box
                px={4}
                py={2.5}
                cursor="pointer"
                _hover={{ bg: "bg.muted" }}
                onClick={() => {
                  setIsMenuOpen(false);
                  onDeleteBoard();
                }}
              >
                <HStack gap={3} color="red.600">
                  <Box as={FiTrash2} fontSize="16px" />
                  <Text fontSize="sm" fontWeight="600">
                    Delete board
                  </Text>
                </HStack>
              </Box>
              <Box
                px={4}
                py={2.5}
                cursor="pointer"
                _hover={{ bg: "bg.muted" }}
                onClick={handleLogout}
              >
                <HStack gap={3}>
                  <Box as={FiLogOut} fontSize="16px" />
                  <Text fontSize="sm" fontWeight="600">
                    Sign out
                  </Text>
                </HStack>
              </Box>
            </Box>
          )}
        </Box>
        <TooltipWrap label={user?.name || "Profile"}>
          <Box>
            <UserDropdown />
          </Box>
        </TooltipWrap>
      </HStack>
    </HStack>
  );
};

export default HeaderActions;
