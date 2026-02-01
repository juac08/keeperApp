import React, { useState } from "react";
import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { FiMessageSquare, FiSend } from "react-icons/fi";
import type { Comment } from "@/types";
import { useAssigneesStore } from "@/state/AssigneesStore";
import { AppButton, AppTextarea } from "@/ui";

type Props = {
  comments: Comment[];
  onAddComment: (text: string) => void;
};

const CommentSection: React.FC<Props> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const { getAssignee } = useAssigneesStore();

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment("");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box>
      <HStack mb={3}>
        <FiMessageSquare size={16} />
        <Text fontSize="sm" fontWeight="600" color="gray.700">
          Comments ({comments.length})
        </Text>
      </HStack>

      <Stack gap={3}>
        {comments.length === 0 ? (
          <Box
            p={4}
            textAlign="center"
            borderRadius="md"
            bg="gray.50"
            border="1px dashed"
            borderColor="gray.300"
          >
            <Text fontSize="sm" color="gray.500">
              No comments yet. Be the first to comment!
            </Text>
          </Box>
        ) : (
          comments.map((comment) => {
            const author = comment.authorId
              ? getAssignee(comment.authorId)
              : null;
            return (
              <Box
                key={comment.id}
                p={3}
                bg="gray.50"
                borderRadius="md"
                borderLeft="3px solid"
                borderLeftColor="blue.400"
              >
                <HStack justify="space-between" mb={1}>
                  <HStack gap={2}>
                    <Box
                      w="24px"
                      h="24px"
                      borderRadius="full"
                      bg="blue.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="xs"
                      fontWeight="600"
                      color="blue.700"
                    >
                      {author?.name.charAt(0).toUpperCase() || "?"}
                    </Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.700">
                      {author?.name || "Unknown"}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    {formatTimestamp(comment.createdAt)}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" whiteSpace="pre-wrap">
                  {comment.text}
                </Text>
              </Box>
            );
          })
        )}

        <VStack gap={2} align="stretch">
          <AppTextarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <HStack justify="flex-end">
            <AppButton
              size="sm"
              onClick={handleSubmit}
              disabled={!newComment.trim()}
            >
              <FiSend size={14} style={{ marginRight: "6px" }} />
              Comment
            </AppButton>
          </HStack>
        </VStack>
      </Stack>
    </Box>
  );
};

export default CommentSection;
