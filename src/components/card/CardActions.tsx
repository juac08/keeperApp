import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import type { Status } from "@/types";
import { AppButton } from "@/ui";

type Props = {
  status: Status;
  onMove: (status: Status) => void;
};

const CardActions: React.FC<Props> = ({ status, onMove }) => {
  return (
    <>
      <Box borderTop="1px solid" borderColor="gray.200" my={3} />
      <HStack gap={2} flexWrap="wrap">
        {status !== "todo" && (
          <AppButton
            size="xs"
            variantStyle="ghost"
            colorScheme="blue"
            px={2}
            h="auto"
            onClick={() => onMove("todo")}
          >
            Move to To Do
          </AppButton>
        )}
        {status !== "inprogress" && (
          <AppButton
            size="xs"
            variantStyle="ghost"
            colorScheme="purple"
            px={2}
            h="auto"
            onClick={() => onMove("inprogress")}
          >
            Move to In Progress
          </AppButton>
        )}
        {status !== "done" && (
          <AppButton
            size="xs"
            variantStyle="ghost"
            colorScheme="green"
            px={2}
            h="auto"
            onClick={() => onMove("done")}
          >
            Move to Complete
          </AppButton>
        )}
      </HStack>
    </>
  );
};

export default CardActions;
