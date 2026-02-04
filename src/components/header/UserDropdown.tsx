import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { useGetMeQuery, useLogoutMutation } from "@/store";
import { AvatarCircle } from "@/ui";

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: user } = useGetMeQuery();
  const [logout] = useLogoutMutation();

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

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  if (!user) return null;

  return (
    <Box position="relative" ref={dropdownRef}>
      <HStack
        gap={2}
        px={3}
        py={2}
        borderRadius="lg"
        bg={isOpen ? "bg.subtle" : "bg.muted"}
        border="1px solid"
        borderColor={isOpen ? "brand.300" : "border.muted"}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ bg: "bg.subtle", borderColor: "brand.300" }}
        onClick={() => setIsOpen(!isOpen)}
        minW="180px"
      >
        <AvatarCircle name={user.name} seed={user.id || user.email} size="32px" />
        <VStack gap={0} align="start" flex="1">
          <Text
            fontSize="sm"
            fontWeight="600"
            color="text.primary"
            lineHeight="1.2"
          >
            {user.name}
          </Text>
          <Text fontSize="xs" color="text.muted" lineHeight="1.2">
            {user.isSuperAdmin
              ? "Super Admin"
              : user.organizationRole || "Member"}
          </Text>
        </VStack>
        <Box
          as={FiChevronDown}
          fontSize="16px"
          color="text.muted"
          transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
          transition="transform 0.2s"
        />
      </HStack>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          right="0"
          bg="bg.panel"
          border="1px solid"
          borderColor="border.muted"
          borderRadius="lg"
          boxShadow="xl"
          zIndex={1000}
          minW="200px"
          overflow="hidden"
          py={2}
        >
          <Box
            px={4}
            py={3}
            borderBottom="1px solid"
            borderBottomColor="border.muted"
          >
            <HStack gap={2}>
              <AvatarCircle
                name={user.name}
                seed={user.id || user.email}
                size="40px"
              />
              <VStack gap={0} align="start">
                <Text fontSize="sm" fontWeight="600" color="text.primary">
                  {user.name}
                </Text>
                <Text fontSize="xs" color="text.muted">
                  {user.email}
                </Text>
                <Text fontSize="xs" color="text.muted">
                  {user.isSuperAdmin
                    ? "Super Admin"
                    : user.organizationRole || "Member"}
                </Text>
              </VStack>
            </HStack>
          </Box>

          <Box p={1}>
            <HStack
              gap={3}
              px={3}
              py={2}
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: "red.50" }}
              transition="all 0.15s"
              onClick={handleLogout}
            >
              <Box as={FiLogOut} fontSize="16px" color="red.500" />
              <Text fontSize="sm" fontWeight="500" color="red.600">
                Sign Out
              </Text>
            </HStack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserDropdown;
