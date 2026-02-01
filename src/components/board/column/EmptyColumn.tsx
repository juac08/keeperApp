import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

const MotionBox = motion(Box);

const EmptyColumn: React.FC = () => {
  return (
    <MotionBox
      border="2px dashed"
      borderColor="gray.300"
      borderRadius="xl"
      p={8}
      textAlign="center"
      bg="gray.50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      <VStack gap={2}>
        <Box as={FiInbox} fontSize="48px" color="gray.400" mb={1} />
        <Text fontWeight="600" color="gray.600" fontSize="md">
          No cards yet
        </Text>
        <Text fontSize="sm" color="gray.500">
          Drag cards here or create a new one
        </Text>
      </VStack>
    </MotionBox>
  );
};

export default EmptyColumn;
