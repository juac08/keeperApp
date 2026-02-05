import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

const MotionBox = motion(Box);

const EmptyColumn: React.FC = () => {
  return (
    <MotionBox
      border="2px dashed"
      borderColor="border.muted"
      borderRadius="2xl"
      p={10}
      textAlign="center"
      bg="linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%)"
      _dark={{
        bg: "linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)",
        borderColor: "rgba(148, 163, 184, 0.4)",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      <VStack gap={2}>
        <Box as={FiInbox} fontSize="52px" color="text.muted" mb={1} />
        <Text fontWeight="700" color="text.secondary" fontSize="md">
          No tasks yet
        </Text>
        <Text fontSize="sm" color="text.muted">
          Drag cards here or create a new one
        </Text>
      </VStack>
    </MotionBox>
  );
};

export default EmptyColumn;
