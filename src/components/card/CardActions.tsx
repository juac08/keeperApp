import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";
import type { Status } from "@/types";
import { AppButton } from "@/ui";

type Props = {
  status: Status;
  onMove: (status: Status) => void;
};

const CardActions: React.FC<Props> = ({ status, onMove }) => {
  return (
    <>
      <Box borderTop="1px solid" borderColor="gray.100" my={3} />
      <HStack gap={2} flexWrap="wrap">
        {status !== "todo" && (
          <AppButton
            size="xs"
            variantStyle="ghost"
            colorScheme="gray"
            px={2}
            h="28px"
            fontSize="xs"
            icon={<FiArrowLeft size={12} />}
            onClick={() => onMove("todo")}
            _hover={{ bg: "gray.100", color: "gray.800" }}
          >
            To Do
          </AppButton>
        )}
        {status !== "inprogress" && (
          <AppButton
            size="xs"
            variantStyle="ghost"
            colorScheme="blue"
            px={2}
            h="28px"
            fontSize="xs"
            icon={
              status === "done" ? (
                <FiArrowLeft size={12} />
              ) : (
                <FiArrowRight size={12} />
              )
            }
            onClick={() => onMove("inprogress")}
            _hover={{ bg: "blue.50", color: "blue.700" }}
          >
            In Progress
          </AppButton>
        )}
        {status !== "done" && (
          <AppButton
            size="xs"
            variantStyle="ghost"
            colorScheme="green"
            px={2}
            h="28px"
            fontSize="xs"
            icon={<FiCheck size={12} />}
            onClick={() => onMove("done")}
            _hover={{ bg: "green.50", color: "green.700" }}
          >
            Complete
          </AppButton>
        )}
      </HStack>
    </>
  );
};

export default CardActions;
