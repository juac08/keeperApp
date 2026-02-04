import React, { useState, useMemo } from "react";
import {
  Box,
  Dialog,
  HStack,
  Stack,
  Text,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { FiX, FiUserPlus, FiTrash2, FiShield } from "react-icons/fi";
import { AppButton, AppIconButton, AppInput, AppSelect } from "@/ui";
import {
  useGetOrganizationMembersQuery,
  useAddOrganizationMemberMutation,
  useUpdateOrganizationMemberRoleMutation,
  useRemoveOrganizationMemberMutation,
  useGetMeQuery,
} from "@/store";
import type { OrganizationRole } from "@/store/api/organizationsApi";
import { appToaster } from "@/shared";

type Props = {
  organizationId: string;
  isOpen: boolean;
  onClose: () => void;
};

const OrganizationMembersModal: React.FC<Props> = ({
  organizationId,
  isOpen,
  onClose,
}) => {
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<OrganizationRole>("member");

  const { data: currentUser } = useGetMeQuery();
  const { data: members = [], isLoading } = useGetOrganizationMembersQuery(
    organizationId,
    {
      skip: !organizationId || organizationId === "",
    },
  );
  const [addMember, { isLoading: isAdding }] =
    useAddOrganizationMemberMutation();
  const [updateRole] = useUpdateOrganizationMemberRoleMutation();
  const [removeMember] = useRemoveOrganizationMemberMutation();

  const canManage =
    currentUser?.organizationRole === "admin" || currentUser?.isSuperAdmin;

  const handleAddMember = async () => {
    if (!searchEmail.trim() || !canManage || !organizationId) return;

    try {
      await addMember({
        organizationId,
        email: searchEmail.trim(),
        role: selectedRole,
      }).unwrap();

      appToaster.success({
        title: "Member added successfully",
      });

      setSearchEmail("");
      setSelectedRole("member");
    } catch (error: any) {
      appToaster.error({
        title: "Failed to add member",
        description: error?.data?.error || "Please try again",
      });
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: OrganizationRole,
  ) => {
    if (!canManage) return;

    try {
      await updateRole({
        organizationId,
        userId,
        role: newRole,
      }).unwrap();

      appToaster.success({
        title: "Role updated successfully",
      });
    } catch (error: any) {
      appToaster.error({
        title: "Failed to update role",
        description: error?.data?.error || "Please try again",
      });
    }
  };

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (!canManage) return;

    if (!confirm(`Remove ${userName} from the organization?`)) return;

    try {
      await removeMember({
        organizationId,
        userId,
      }).unwrap();

      appToaster.success({
        title: "Member removed successfully",
      });
    } catch (error: any) {
      appToaster.error({
        title: "Failed to remove member",
        description: error?.data?.error || "Please try again",
      });
    }
  };

  const getRoleBadgeColor = (role: OrganizationRole) => {
    switch (role) {
      case "admin":
        return "purple";
      case "member":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <Dialog.Positioner>
        <Dialog.Content
          borderRadius="lg"
          overflow="hidden"
          maxW="600px"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.15)"
          bg="bg.panel"
        >
          <Dialog.Header
            bg="bg.panel"
            py={4}
            px={6}
            borderBottom="1px solid"
            borderColor="border.muted"
          >
            <HStack justify="space-between">
              <HStack gap={2}>
                <FiShield size={20} />
                <Text fontSize="lg" fontWeight="600" color="text.primary">
                  Organization Members
                </Text>
              </HStack>
              <Dialog.CloseTrigger
                borderRadius="md"
                _hover={{ bg: "bg.muted" }}
              >
                <FiX size={18} />
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>

          <Dialog.Body bg="bg.panel" px={6} py={6}>
            {!organizationId ? (
              <Box textAlign="center" py={8}>
                <Text color="text.muted" fontSize="sm">
                  Organization not found. Please contact support.
                </Text>
              </Box>
            ) : (
              <Stack gap={5}>
                {canManage && (
                  <Box
                    p={4}
                    bg="blue.50"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="blue.200"
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color="text.primary"
                      mb={3}
                    >
                      Invite New Member
                    </Text>
                    <HStack gap={2}>
                      <Box flex="1">
                        <AppInput
                          type="email"
                          placeholder="Enter email address"
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddMember();
                            }
                          }}
                        />
                      </Box>
                      <Box width="150px" minW="140px">
                        <AppSelect
                          name="role"
                          value={selectedRole}
                          onChange={(e) =>
                            setSelectedRole(e.target.value as OrganizationRole)
                          }
                          rootProps={{ size: "md" }}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </AppSelect>
                      </Box>
                      <AppButton
                        variantStyle="primary"
                        onClick={handleAddMember}
                        size="md"
                        icon={<FiUserPlus size={16} />}
                        loading={isAdding}
                        disabled={!searchEmail.trim()}
                      >
                        Add
                      </AppButton>
                    </HStack>
                  </Box>
                )}

                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="text.secondary"
                    mb={3}
                  >
                    MEMBERS (
                    {
                      members.filter(
                        (m) =>
                          !m.user.isSuperAdmin &&
                          m.user.name !== "System Admin",
                      ).length
                    }
                    )
                  </Text>

                  {isLoading ? (
                    <Box textAlign="center" py={8}>
                      <Spinner size="lg" color="brand.500" />
                    </Box>
                  ) : members.length === 0 ? (
                    <Box
                      textAlign="center"
                      py={8}
                      px={4}
                      bg="bg.muted"
                      borderRadius="lg"
                    >
                      <Text color="text.muted" fontSize="sm">
                        No members yet. Invite users to get started!
                      </Text>
                    </Box>
                  ) : (
                    <Stack gap={2}>
                      {members
                        .filter(
                          (member) =>
                            !member.user.isSuperAdmin &&
                            member.user.name !== "System Admin",
                        )
                        .map((member) => {
                          const isSuperAdmin = member.user.isSuperAdmin;
                          const isCurrentUser =
                            member.userId === currentUser?.id;
                          const canModify =
                            canManage && !isSuperAdmin && !isCurrentUser;

                          return (
                            <Box
                              key={member.id}
                              p={3}
                              bg="bg.muted"
                              borderRadius="lg"
                              border="1px solid"
                              borderColor="border.muted"
                            >
                              <HStack justify="space-between">
                                <HStack gap={3} flex="1">
                                  <Box
                                    w="40px"
                                    h="40px"
                                    borderRadius="full"
                                    bg="blue.100"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="blue.700"
                                  >
                                    {member.user.avatar ||
                                      (() => {
                                        const names = member.user.name
                                          .trim()
                                          .split(/\s+/);
                                        const initials =
                                          names.length > 1
                                            ? names[0].charAt(0).toUpperCase() +
                                              names[names.length - 1]
                                                .charAt(0)
                                                .toUpperCase()
                                            : names[0].charAt(0).toUpperCase();
                                        return initials;
                                      })()}
                                  </Box>
                                  <Stack gap={0} flex="1">
                                    <HStack gap={2}>
                                      <Text
                                        fontSize="sm"
                                        fontWeight="600"
                                        color="text.primary"
                                      >
                                        {member.user.name}
                                      </Text>
                                      {isCurrentUser && (
                                        <Badge
                                          fontSize="xs"
                                          colorScheme="green"
                                          variant="subtle"
                                        >
                                          You
                                        </Badge>
                                      )}
                                      {isSuperAdmin && (
                                        <Badge
                                          fontSize="xs"
                                          colorScheme="red"
                                          variant="subtle"
                                        >
                                          Super Admin
                                        </Badge>
                                      )}
                                    </HStack>
                                    <Text fontSize="xs" color="text.muted">
                                      {member.user.email}
                                    </Text>
                                  </Stack>
                                </HStack>

                                <HStack gap={2}>
                                  {canModify ? (
                                    <Box width="130px" minW="120px">
                                      <AppSelect
                                        name="memberRole"
                                        value={member.role}
                                        onChange={(e) =>
                                          handleRoleChange(
                                            member.userId,
                                            e.target.value as OrganizationRole,
                                          )
                                        }
                                        rootProps={{ size: "sm" }}
                                      >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                      </AppSelect>
                                    </Box>
                                  ) : (
                                    <Badge
                                      fontSize="xs"
                                      colorScheme={getRoleBadgeColor(
                                        member.role,
                                      )}
                                      variant="subtle"
                                      px={3}
                                      py={1}
                                      textTransform="capitalize"
                                    >
                                      {member.role}
                                    </Badge>
                                  )}

                                  {canModify && (
                                    <AppIconButton
                                      aria-label="Remove member"
                                      size="sm"
                                      onClick={() =>
                                        handleRemoveMember(
                                          member.userId,
                                          member.user.name,
                                        )
                                      }
                                      color="red.500"
                                      _hover={{ bg: "red.50" }}
                                    >
                                      <FiTrash2 size={16} />
                                    </AppIconButton>
                                  )}
                                </HStack>
                              </HStack>
                            </Box>
                          );
                        })}
                    </Stack>
                  )}
                </Box>
              </Stack>
            )}
          </Dialog.Body>

          <Dialog.Footer
            bg="bg.panel"
            py={4}
            px={6}
            borderTop="1px solid"
            borderColor="border.muted"
          >
            <HStack justify="flex-end" w="100%">
              <AppButton variantStyle="ghost" onClick={onClose}>
                Close
              </AppButton>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default OrganizationMembersModal;
