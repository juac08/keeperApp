import React, { useState } from "react";
import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { FiMessageSquare, FiSend } from "react-icons/fi";
import type { Comment } from "@/types";
import { useAssigneesStore } from "@/state/AssigneesStore";
import { AppButton, AppTextarea, AvatarCircle } from "@/ui";

type Props = {
  comments: Comment[];
  onAddComment: (text: string) => void | Promise<void>;
};

const CommentSection: React.FC<Props> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const { getAssignee } = useAssigneesStore();

  const handleSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      await onAddComment(trimmed);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment", error);
    }
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
      <HStack mb={3} justify="space-between">
        <HStack gap={2}>
          <Box
            w="28px"
            h="28px"
            borderRadius="10px"
            bg="bg.muted"
            border="1px solid"
            borderColor="border.muted"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiMessageSquare size={14} />
          </Box>
          <Text fontSize="sm" fontWeight="700" color="text.primary">
            Comments
          </Text>
          <Box
            px={2}
            py={0.5}
            borderRadius="full"
            fontSize="xs"
            fontWeight="700"
            bg="blue.50"
            color="blue.700"
          >
            {comments.length}
          </Box>
        </HStack>
      </HStack>

      <Stack gap={3}>
        {comments.length === 0 ? (
          <Box
            p={4}
            textAlign="center"
            borderRadius="lg"
            bg="bg.muted"
            border="1px dashed"
            borderColor="border.muted"
          >
            <Text fontSize="sm" color="text.muted">
              No comments yet. Start the conversation.
            </Text>
          </Box>
        ) : (
          comments.map((comment) => {
            const author = comment.authorId
              ? getAssignee(comment.authorId)
              : null;
            const displayName =
              author?.name || comment.authorName || "Unknown";
            const initialsSource = author?.name || comment.authorName;
            const initial = initialsSource
              ? initialsSource.charAt(0).toUpperCase()
              : "?";
            return (
              <Box
                key={comment.id}
                p={3}
                bg="bg.panel"
                borderRadius="lg"
                border="1px solid"
                borderColor="border.muted"
                _hover={{ borderColor: "blue.100" }}
                transition="all 0.15s"
              >
                <HStack align="flex-start" gap={3}>
                  <AvatarCircle
                    name={displayName}
                    avatar={author?.avatar}
                    seed={author?.id || comment.id}
                    size="30px"
                    fontSize="xs"
                  />
                  <Box flex="1">
                    <HStack justify="space-between" align="center">
                      <Text fontSize="sm" fontWeight="700" color="text.primary">
                        {displayName}
                      </Text>
                      <Text fontSize="xs" color="text.muted">
                        {formatTimestamp(comment.createdAt)}
                      </Text>
                    </HStack>
                    <Text
                      fontSize="sm"
                      color="text.secondary"
                      whiteSpace="pre-wrap"
                      mt={1}
                    >
                      {comment.text}
                    </Text>
                  </Box>
                </HStack>
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
