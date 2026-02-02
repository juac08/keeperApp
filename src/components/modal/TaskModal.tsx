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
import type { Priority, Status, Subtask } from "@/types";
import { AppButton, AppInput, AppTextarea } from "@/ui";
import {
  PrioritySelect,
  StatusSelect,
  DatePicker,
  TagInput,
  AssigneeSelect,
  SubtaskList,
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
  subtasks: Subtask[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: React.FormEvent) => void | Promise<void>;
  editingId: string | null;
  form: FormState;
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
          borderRadius="lg"
          overflow="hidden"
          maxW="900px"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.15)"
          bg="bg.panel"
        >
          <Dialog.Header
            bg="bg.panel"
            py={4}
            px={6}
            borderBottom="1px solid"
            borderColor="border.muted"
          >
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="600" color="text.secondary">
                {editingId ? "Edit task" : "Create task"}
              </Text>
              <Dialog.CloseTrigger
                borderRadius="md"
                _hover={{ bg: "gray.100" }}
              />
            </HStack>
          </Dialog.Header>

          <Dialog.Body bg="bg.panel" px={6} pt={6} pb={6}>
            <Stack gap={5}>
              {/* Title */}
              <Field.Root>
                <AppInput
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Task title"
                  fontSize="md"
                  fontWeight="500"
                />
              </Field.Root>

              {/* Description */}
              <Field.Root>
                <Field.Label
                  fontSize="xs"
                  fontWeight="600"
                  color="gray.600"
                  mb={2}
                >
                  DESCRIPTION
                </Field.Label>
                <AppTextarea
                  name="content"
                  value={form.content}
                  onChange={onChange}
                  placeholder="Add a description..."
                  rows={4}
                />
              </Field.Root>

              {/* Two Column Layout */}
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
                {/* Left Column */}
                <Stack gap={4}>
                  <Field.Root>
                    <Field.Label
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.600"
                      mb={2}
                    >
                      STATUS
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
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.600"
                      mb={2}
                    >
                      PRIORITY
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
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.600"
                      mb={2}
                    >
                      ASSIGNEE
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

                {/* Right Column */}
                <Stack gap={4}>
                  <Field.Root>
                    <Field.Label
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.600"
                      mb={2}
                    >
                      DUE DATE
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
                    <TagInput
                      selectedTags={form.tags}
                      onChange={(tags) =>
                        onChange({
                          target: { name: "tags", value: tags },
                        } as any)
                      }
                    />
                  </Field.Root>

                  {form.blocked && (
                    <Field.Root>
                      <Field.Label
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                        mb={2}
                      >
                        BLOCKED REASON
                      </Field.Label>
                      <AppInput
                        name="blockedReason"
                        value={form.blockedReason}
                        onChange={onChange}
                        placeholder="What's blocking this?"
                      />
                    </Field.Root>
                  )}
                </Stack>
              </Grid>

              {/* Subtasks */}
              <Box pt={3} borderTop="1px solid" borderColor="border.muted">
                <SubtaskList
                  subtasks={form.subtasks}
                  onChange={(subtasks) =>
                    onChange({
                      target: { name: "subtasks", value: subtasks },
                    } as any)
                  }
                />
              </Box>

              {/* Blocked Toggle */}
              <HStack pt={2}>
                <AppButton
                  size="sm"
                  variantStyle={form.blocked ? "primary" : "outline"}
                  onClick={() =>
                    onToggleBlocked({
                      target: {
                        checked: !form.blocked,
                      } as HTMLInputElement,
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  {form.blocked ? "🚫 Blocked" : "Mark as blocked"}
                </AppButton>
              </HStack>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer
            bg="bg.panel"
            py={4}
            px={6}
            borderTop="1px solid"
            borderColor="border.muted"
          >
            <HStack w="100%" justify="flex-end" gap={3}>
              <AppButton variantStyle="ghost" onClick={onClose}>
                Cancel
              </AppButton>
              <AppButton variantStyle="primary" onClick={onSave}>
                {editingId ? "Save" : "Create"}
              </AppButton>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default TaskModal;
