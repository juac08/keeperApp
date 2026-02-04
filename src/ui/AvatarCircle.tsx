import React, { useEffect, useMemo, useState } from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import { getInitials, resolveAvatarSrc } from "@/utils/avatar";

type Props = {
  name: string;
  avatar?: string;
  seed?: string;
  size: string | number;
  fontSize?: string | number;
};

const AvatarCircle: React.FC<Props> = ({
  name,
  avatar,
  seed,
  size,
  fontSize = "sm",
}) => {
  const src = useMemo(
    () => resolveAvatarSrc(avatar, seed || name),
    [avatar, seed, name],
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <Box
      w={size}
      h={size}
      borderRadius="full"
      bg="bg.muted"
      border="1px solid"
      borderColor="border.muted"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {!failed && (
        <Image
          src={src}
          alt={name}
          width="100%"
          height="100%"
          objectFit="cover"
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <Text fontSize={fontSize} fontWeight="600" color="text.primary">
          {getInitials(name)}
        </Text>
      )}
    </Box>
  );
};

export default AvatarCircle;
