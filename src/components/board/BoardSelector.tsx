import React, { useState, useRef, useEffect } from "react";
import { Box, HStack, Text, Stack } from "@chakra-ui/react";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import { useGetBoardsQuery, setActiveBoard, useGetMeQuery } from "@/store";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { AppButton } from "@/ui";
import { BOARD_TEMPLATES } from "@/config/boardTemplates";

type Props = {
  onCreateBoard: () => void;
};

const BoardSelector: React.FC<Props> = ({ onCreateBoard }) => {
  const dispatch = useAppDispatch();
  const { data: boards = [] } = useGetBoardsQuery();
  const { data: user } = useGetMeQuery();
  const activeBoardId = useAppSelector(
    (state) => state.activeBoard.activeBoardId,
  );
  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is admin (can create boards)
  const canCreateBoard =
    user?.organizationRole === "admin" || user?.isSuperAdmin;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (boardId: string) => {
    dispatch(setActiveBoard(boardId));
    setIsOpen(false);
  };

  const resolveBoardIcon = (board: typeof boards[number] | undefined) => {
    if (!board) return "📋";
    if (board.icon) return board.icon;
    if (board.template && BOARD_TEMPLATES[board.template]) {
      return BOARD_TEMPLATES[board.template].icon;
    }
    return "📋";
  };

  if (boards.length === 0) {
    // Only show create button for admins
    if (canCreateBoard) {
      return (
        <AppButton
          size="sm"
          variantStyle="primary"
          onClick={onCreateBoard}
          icon={<FiPlus size={14} />}
        >
          Create Board
        </AppButton>
      );
    }
    // Non-admins see message
    return (
      <Box px={3} py={2} borderRadius="md" bg="bg.muted">
        <Text fontSize="sm" color="text.muted">
          No boards available. Contact your admin.
        </Text>
      </Box>
    );
  }

  return (
    <Box position="relative" ref={dropdownRef}>
      <Box
        onClick={() => setIsOpen(!isOpen)}
        cursor="pointer"
        px={3}
        py={2}
        bg="bg.panel"
        border="1px solid"
        borderColor={isOpen ? "blue.400" : "gray.200"}
        boxShadow={isOpen ? "0 0 0 1px #4299e1" : "none"}
        borderRadius="md"
        _hover={{ borderColor: isOpen ? "blue.400" : "gray.300" }}
        transition="all 0.2s"
      >
        <HStack gap={2}>
          <Text fontSize="lg">{resolveBoardIcon(activeBoard)}</Text>
          <Text fontSize="sm" fontWeight="600" color="text.primary">
            {activeBoard?.name || "Select Board"}
          </Text>
          <Box
            as={FiChevronDown}
            fontSize="14px"
            color="text.muted"
            transform={isOpen ? "rotate(180deg)" : "rotate(0)"}
            transition="transform 0.2s"
          />
        </HStack>
      </Box>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left="0"
          minW="280px"
          maxW="320px"
          bg="bg.panel"
          borderRadius="lg"
          border="2px solid"
          borderColor="border.muted"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
          p={2}
          zIndex={10}
        >
          {boards.map((board) => (
            <Box
              key={board.id}
              onClick={() => handleSelect(board.id)}
              bg={board.id === activeBoardId ? "blue.50" : "transparent"}
              borderRadius="md"
              px={3}
              py={2.5}
              cursor="pointer"
              _hover={{
                bg: board.id === activeBoardId ? "blue.100" : "bg.muted",
              }}
            >
              <HStack gap={2.5} w="100%">
                <Text fontSize="xl">{resolveBoardIcon(board)}</Text>
                <Stack gap={0} flex="1" minW="0">
                  <Text fontSize="sm" fontWeight="600" color="text.primary">
                    {board.name}
                  </Text>
                  {board.description && (
                    <Text fontSize="xs" color="text.muted" lineClamp={1}>
                      {board.description}
                    </Text>
                  )}
                </Stack>
              </HStack>
            </Box>
          ))}
          {canCreateBoard && (
            <Box
              borderTop="1px solid"
              borderColor="border.muted"
              mt={1.5}
              pt={1.5}
            >
              <Box
                onClick={() => {
                  onCreateBoard();
                  setIsOpen(false);
                }}
                borderRadius="md"
                px={3}
                py={2.5}
                cursor="pointer"
                _hover={{ bg: "blue.50" }}
              >
                <HStack gap={2} color="blue.600">
                  <FiPlus size={16} />
                  <Text fontSize="sm" fontWeight="600">
                    Create New Board
                  </Text>
                </HStack>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BoardSelector;
