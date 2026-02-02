import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiArchive } from "react-icons/fi";
import type { Status } from "@/types";
import { AppButton } from "@/ui";

type Props = {
  status: Status;
  onMove: (status: Status) => void;
  onArchive: () => void;
};

const CardActions: React.FC<Props> = ({ status, onMove, onArchive }) => {
  return null;
};

export default CardActions;
