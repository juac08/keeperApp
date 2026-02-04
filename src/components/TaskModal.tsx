import React from "react";
import {
  Box,
  Dialog,
  Field,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiColumns } from "react-icons/fi";
import type { Priority, Status } from "../types";
import { AppButton, AppInput, AppTextarea } from "@/ui";
import {
  PrioritySelect,
  StatusSelect,
  DatePicker,
  TagInput,
  AssigneeSelect,
} from "@/components/form";

type FormState = {
  title: string;
  content: string;
  status: Status;
  priority: Priority;
  blocked: boolean;
  blockedReason: string;
  dueDate: string;
  tags: string[];
  assigneeId: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: React.FormEvent) => void;
  editingId: string | null;
  form: FormState;
  isSaving?: boolean;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onToggleBlocked: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TaskModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editingId,
  form,
  isSaving = false,
  onChange,
  onToggleBlocked,
}) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <Dialog.Positioner>
        <Dialog.Content
          borderRadius="3xl"
          overflow="hidden"
          maxW="1000px"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          border="1px solid"
          borderColor="border.muted"
        >
          <Dialog.Header
            bg="bg.panel"
            py={6}
            px={{ base: 6, md: 10 }}
            pr={{ base: 16, md: 18 }}
            borderBottom="1px solid"
            borderColor="border.muted"
          >
            <HStack gap={3} alignItems="center">
              <Box
                w="52px"
                h="52px"
                borderRadius="18px"
                bg="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="lg"
                flexShrink={0}
              >
                <Box as={FiColumns} fontSize="24px" />
              </Box>
              <Box flex="1">
                <Text
                  fontSize="xs"
                  color="text.muted"
                  fontWeight="600"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  mb={1}
                >
                  Task Editor
                </Text>
                <Heading
                  size="xl"
                  fontWeight="700"
                  color="text.primary"
                  letterSpacing="tight"
                >
                  {editingId ? "Edit task" : "New task"}
                </Heading>
              </Box>
            </HStack>
            <Dialog.CloseTrigger
              position="absolute"
              right="20px"
              top="20px"
              borderRadius="lg"
              color="text.muted"
              _hover={{ bg: "bg.muted" }}
            />
          </Dialog.Header>
          <Dialog.Body bg="bg.panel" px={{ base: 6, md: 10 }} pt={8} pb={10}>
            <Grid templateColumns={{ base: "1fr", md: "1.8fr 1fr" }} gap={8}>
              <Stack gap={6}>
                <Field.Root>
                  <Field.Label
                    fontSize="sm"
                    color="text.secondary"
                    fontWeight="600"
                    mb={2.5}
                  >
                    Title
                  </Field.Label>
                  <AppInput
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    placeholder="Add a task title"
                    size="lg"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label
                    fontSize="sm"
                    color="text.secondary"
                    fontWeight="600"
                    mb={2.5}
                  >
                    Description
                  </Field.Label>
                  <AppTextarea
                    name="content"
                    value={form.content}
                    onChange={onChange}
                    placeholder="Add details, links, or next steps."
                    rows={11}
                    size="lg"
                  />
                </Field.Root>
                <Field.Root>
                  <TagInput
                    selectedTags={form.tags}
                    onChange={(tags) =>
                      onChange({
                        target: { name: "tags", value: tags },
                      } as any)
                    }
                  />
                </Field.Root>
              </Stack>
              <Stack gap={5}>
                <Box
                  bg="gradient-to-br"
                  bgGradient="linear(to-br, blue.50, purple.50)"
                  borderRadius="2xl"
                  p={6}
                  border="1px solid"
                  borderColor="blue.100"
                  boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
                >
                  <Stack gap={5}>
                    <Field.Root>
                      <Field.Label
                        fontSize="sm"
                        color="text.secondary"
                        fontWeight="600"
                        mb={2.5}
                      >
                        Priority
                      </Field.Label>
                      <PrioritySelect
                        value={form.priority}
                        onChange={(priority) =>
                          onChange({
                            target: { name: "priority", value: priority },
                          } as React.ChangeEvent<HTMLSelectElement>)
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label
                        fontSize="sm"
                        color="text.secondary"
                        fontWeight="600"
                        mb={2.5}
                      >
                        Status
                      </Field.Label>
                      <StatusSelect
                        value={form.status}
                        onChange={(status) =>
                          onChange({
                            target: { name: "status", value: status },
                          } as React.ChangeEvent<HTMLSelectElement>)
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label
                        fontSize="sm"
                        color="text.secondary"
                        fontWeight="600"
                        mb={2.5}
                      >
                        Due Date
                      </Field.Label>
                      <DatePicker
                        value={form.dueDate}
                        onChange={(date) =>
                          onChange({
                            target: { name: "dueDate", value: date },
                          } as any)
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label
                        fontSize="sm"
                        color="text.secondary"
                        fontWeight="600"
                        mb={2.5}
                      >
                        Assignee
                      </Field.Label>
                      <AssigneeSelect
                        value={form.assigneeId}
                        onChange={(assigneeId) =>
                          onChange({
                            target: { name: "assigneeId", value: assigneeId },
                          } as any)
                        }
                      />
                    </Field.Root>
                  </Stack>
                </Box>
                <Box
                  bg="purple.50"
                  borderRadius="2xl"
                  p={5}
                  border="2px solid"
                  borderColor="purple.100"
                  boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
                  position="relative"
                  zIndex={1}
                >
                  <Field.Root>
                    <Stack justify="space-between" mb={3}>
                      <AppButton
                        size="sm"
                        variantStyle={form.blocked ? "primary" : "outline"}
                        colorScheme="purple"
                        onClick={() =>
                          onToggleBlocked({
                            target: {
                              checked: !form.blocked,
                            } as HTMLInputElement,
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                      >
                        {form.blocked ? "🚫 Blocked" : "✅ Not blocked"}
                      </AppButton>
                    </Stack>
                    {form.blocked && (
                      <AppInput
                        name="blockedReason"
                        value={form.blockedReason}
                        onChange={onChange}
                        placeholder="What's blocking this task?"
                        size="md"
                      />
                    )}
                  </Field.Root>
                </Box>
              </Stack>
            </Grid>
          </Dialog.Body>
          <Dialog.Footer
            bg="bg.panel"
            pt={5}
            pb={6}
            px={{ base: 6, md: 10 }}
            borderTop="1px solid"
            borderColor="border.muted"
          >
            <HStack w="100%" justify="flex-end" gap={3}>
              <AppButton
                variantStyle="ghost"
                onClick={onClose}
                size="lg"
                px={6}
              >
                Cancel
              </AppButton>
              <AppButton
                variantStyle="primary"
                onClick={onSave}
                size="lg"
                px={8}
                boxShadow="0 4px 14px 0 rgba(102, 126, 234, 0.39)"
                loading={isSaving}
                disabled={isSaving}
              >
                {editingId ? "💾 Save changes" : "✨ Create task"}
              </AppButton>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default TaskModal;
