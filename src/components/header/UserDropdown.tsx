import React from "react";
import { Box } from "@chakra-ui/react";
import { useGetMeQuery } from "@/store";
import { AvatarCircle } from "@/ui";

const UserDropdown: React.FC = () => {
  const { data: user } = useGetMeQuery();

  if (!user) return null;

  return (
    <Box
      border="1px solid"
      borderColor="border.muted"
      borderRadius="full"
      p="3px"
      bg="bg.panel"
    >
      <AvatarCircle name={user.name} seed={user.id || user.email} size="34px" />
    </Box>
  );
};

export default UserDropdown;
