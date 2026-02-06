import React from "react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";
import { AppButton, EmptyState } from "@/ui";

const MotionBox = motion(Box);

type Props = {
  title: string;
  description: string;
  onCreate?: () => void;
};

const EmptyColumn: React.FC<Props> = ({ title, description, onCreate }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      <EmptyState
        icon={<Box as={FiInbox} fontSize="52px" color="text.muted" mb={1} />}
        title={title}
        description={description}
        action={
          onCreate ? (
            <AppButton size="sm" variantStyle="outline" onClick={onCreate}>
              Create task
            </AppButton>
          ) : null
        }
      />
    </MotionBox>
  );
};

export default EmptyColumn;
