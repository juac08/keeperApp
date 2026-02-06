import React, { useState } from "react";
import {
  Box,
  Dialog,
  Stack,
  Text,
  HStack,
  Badge,
  IconButton,
  Spinner,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { FiUserPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { AppButton, AppInput, AppMenuSelect, ModalHeader } from "@/ui";
import {
  useGetBoardMembersQuery,
  useAddBoardMemberMutation,
  useRemoveBoardMemberMutation,
  useUpdateBoardMemberRoleMutation,
  useSearchUsersQuery,
} from "@/store";
import type { BoardMemberRole } from "@/types";
import { appToaster } from "@/shared";
import { useGetMeQuery } from "@/store";

type Props = {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
};

const ROLES: { value: BoardMemberRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

const BoardMembersModal: React.FC<Props> = ({ boardId, isOpen, onClose }) => {
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<BoardMemberRole>("member");

  const { data: currentUser } = useGetMeQuery();
  const { data: members = [], isLoading: loadingMembers } =
    useGetBoardMembersQuery(boardId, { skip: !isOpen });
  const { data: searchResults = [], isFetching: searchingUsers } =
    useSearchUsersQuery(searchEmail, {
      skip: !searchEmail || searchEmail.length < 3,
    });

  const [addMember, { isLoading: adding }] = useAddBoardMemberMutation();
  const [removeMember, { isLoading: removing }] =
    useRemoveBoardMemberMutation();
  const [updateRole] = useUpdateBoardMemberRoleMutation();

  const currentMember = members.find((m) => m.userId === currentUser?.id);
  const canManage =
    currentMember?.role === "owner" || currentMember?.role === "admin";

  const handleAddMember = async () => {
    if (!selectedUserId) {
      appToaster.error({ title: "Please select a user" });
      return;
    }

    try {
      await addMember({
        boardId,
        userId: selectedUserId,
        role: selectedRole,
      }).unwrap();
      appToaster.success({ title: "Member added successfully" });
      setSearchEmail("");
      setSelectedUserId("");
      setSelectedRole("member");
    } catch (error: any) {
      appToaster.error({
        title: "Failed to add member",
        description: error?.data?.error || "Please try again",
      });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember({ boardId, userId }).unwrap();
      appToaster.success({ title: "Member removed" });
    } catch (error: any) {
      appToaster.error({
        title: "Failed to remove member",
        description: error?.data?.error || "Please try again",
      });
    }
  };

  const handleUpdateRole = async (userId: string, role: BoardMemberRole) => {
    try {
      await updateRole({ boardId, userId, role }).unwrap();
      appToaster.success({ title: "Role updated" });
    } catch (error: any) {
      appToaster.error({
        title: "Failed to update role",
        description: error?.data?.error || "Please try again",
      });
    }
  };

  const getRoleBadgeColor = (role: BoardMemberRole) => {
    switch (role) {
      case "owner":
        return "purple";
      case "admin":
        return "blue";
      case "member":
        return "green";
      case "viewer":
        return "gray";
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
          borderRadius="2xl"
          overflow="hidden"
          maxW="680px"
          maxH="90vh"
          boxShadow="0 24px 60px rgba(15, 23, 42, 0.18)"
          bg="bg.panel"
        >
          <ModalHeader
            label="Board"
            title="Manage board members"
            icon={<FiUsers size={18} />}
            iconGradient="linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)"
            iconShadow="0 10px 20px rgba(37, 99, 235, 0.25)"
            onClose={onClose}
          />

          <Dialog.Body
            bg="bg.panel"
            px={{ base: 6, md: 8 }}
            py={6}
            overflowY="auto"
          >
            <Stack gap={6}>
              {/* Add Member Section */}
              {canManage && (
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="text.primary"
                    mb={3}
                  >
                    Add Member
                  </Text>
                  <Stack gap={3}>
                    <Box position="relative">
                      <AppInput
                        placeholder="Search by email..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        pr="44px"
                      />
                      <Box
                        position="absolute"
                        right="12px"
                        top="50%"
                        transform="translateY(-50%)"
                        color="text.muted"
                      >
                        {searchingUsers ? (
                          <Spinner size="sm" />
                        ) : (
                          <FiSearch size={16} />
                        )}
                      </Box>
                    </Box>

                    {searchResults.length > 0 && (
                      <Stack
                        gap={2}
                        maxH="150px"
                        overflowY="auto"
                        p={2}
                        bg="bg.muted"
                        borderRadius="md"
                      >
                        {searchResults
                          .filter((user) => !user.isSuperAdmin)
                          .map((user) => {
                            const alreadyMember = members.some(
                              (m) => m.userId === user.id,
                            );
                            return (
                              <HStack
                                key={user.id}
                                p={2}
                                borderRadius="md"
                                bg={
                                  selectedUserId === user.id
                                    ? "brand.100"
                                    : "bg.panel"
                                }
                                cursor={
                                  alreadyMember ? "not-allowed" : "pointer"
                                }
                                opacity={alreadyMember ? 0.5 : 1}
                                onClick={() =>
                                  !alreadyMember && setSelectedUserId(user.id)
                                }
                                _hover={
                                  !alreadyMember ? { bg: "bg.muted" } : {}
                                }
                              >
                                <Box flex="1">
                                  <Text fontSize="sm" color="text.primary">
                                    {user.name}
                                  </Text>
                                  <Text fontSize="xs" color="text.muted">
                                    {user.email}
                                  </Text>
                                </Box>
                                {alreadyMember && (
                                  <Badge size="sm" colorScheme="gray">
                                    Already member
                                  </Badge>
                                )}
                              </HStack>
                            );
                          })}
                      </Stack>
                    )}

                    {selectedUserId && (
                      <HStack gap={2}>
                        <Box flex="1" minW="140px">
                          <AppMenuSelect
                            value={selectedRole}
                            options={ROLES}
                            onChange={(value) =>
                              setSelectedRole(value as BoardMemberRole)
                            }
                          />
                        </Box>
                        <AppButton
                          variantStyle="primary"
                          onClick={handleAddMember}
                          loading={adding}
                        >
                          <HStack gap={1}>
                            <FiUserPlus />
                            <Text>Add</Text>
                          </HStack>
                        </AppButton>
                      </HStack>
                    )}
                  </Stack>
                </Box>
              )}

              {/* Members List */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="text.primary"
                  mb={3}
                >
                  Members (
                  {
                    members.filter(
                      (m) =>
                        !m.user.isSuperAdmin && m.user.name !== "System Admin",
                    ).length
                  }
                  )
                </Text>
                {loadingMembers ? (
                  <Stack gap={3}>
                    {[0, 1, 2].map((row) => (
                      <HStack
                        key={row}
                        p={3}
                        bg="bg.muted"
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="border.muted"
                        justify="space-between"
                      >
                        <HStack gap={3} flex="1">
                          <Skeleton w="32px" h="32px" borderRadius="full" />
                          <Box flex="1">
                            <Skeleton h="12px" w="140px" mb={2} />
                            <SkeletonText noOfLines={1} w="200px" />
                          </Box>
                        </HStack>
                        <Skeleton h="36px" w="120px" borderRadius="md" />
                      </HStack>
                    ))}
                  </Stack>
                ) : (
                  <Stack gap={2}>
                    {members
                      .filter(
                        (member) =>
                          !member.user.isSuperAdmin &&
                          member.user.name !== "System Admin",
                      )
                      .map((member) => {
                        const isCurrentUser = member.userId === currentUser?.id;
                        const canRemove =
                          canManage &&
                          !isCurrentUser &&
                          member.role !== "owner";
                        const canChangeRole =
                          canManage &&
                          !isCurrentUser &&
                          currentMember?.role === "owner";

                        return (
                          <HStack
                            key={member.id}
                            p={3}
                            bg="bg.muted"
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor="border.muted"
                          >
                            <Box flex="1">
                              <HStack gap={2}>
                                <Text fontSize="sm" color="text.primary">
                                  {member.user.name}
                                  {isCurrentUser && " (You)"}
                                </Text>
                                <Badge
                                  size="sm"
                                  colorScheme={getRoleBadgeColor(member.role)}
                                >
                                  {member.role}
                                </Badge>
                              </HStack>
                              <Text fontSize="xs" color="text.muted" mt={0.5}>
                                {member.user.email}
                              </Text>
                            </Box>
                            <HStack gap={3} align="center">
                              {canChangeRole && (
                                <Box minW="150px">
                                  <AppMenuSelect
                                    value={member.role}
                                    options={ROLES.filter(
                                      (r) => r.value !== "owner",
                                    )}
                                    onChange={(value) =>
                                      handleUpdateRole(
                                        member.userId,
                                        value as BoardMemberRole,
                                      )
                                    }
                                  />
                                </Box>
                              )}
                              {canRemove && (
                                <Box ml={1}>
                                  <IconButton
                                    aria-label="Remove member"
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() =>
                                      handleRemoveMember(member.userId)
                                    }
                                    disabled={removing}
                                  >
                                    <FiTrash2 />
                                  </IconButton>
                                </Box>
                              )}
                            </HStack>
                          </HStack>
                        );
                      })}
                  </Stack>
                )}
              </Box>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer
            bg="bg.panel"
            px={6}
            py={4}
            borderTop="1px solid"
            borderColor="border.muted"
          >
            <AppButton variantStyle="outline" onClick={onClose}>
              Close
            </AppButton>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default BoardMembersModal;
