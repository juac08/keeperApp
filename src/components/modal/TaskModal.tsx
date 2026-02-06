import React from "react";
import {
  Box,
  Dialog,
  Field,
  Grid,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiEdit2, FiPlus, FiX } from "react-icons/fi";
import type { Priority, Status, Subtask } from "@/types";
import { AppButton, AppIconButton, AppInput, AppTextarea } from "@/ui";
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
  isSaving?: boolean;
  errors?: Partial<Record<keyof FormState, string>>;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onToggleBlocked: (
    eventOrChecked: React.ChangeEvent<HTMLInputElement> | boolean,
  ) => void;
};

const TaskModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editingId,
  form,
  isSaving = false,
  errors,
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
          borderRadius="2xl"
          overflow="hidden"
          maxW="980px"
          boxShadow="0 24px 60px rgba(15, 23, 42, 0.18)"
          bg="bg.panel"
        >
          <Dialog.Header
            bg="bg.panel"
            py={5}
            px={{ base: 6, md: 8 }}
            borderBottom="1px solid"
            borderColor="border.muted"
          >
            <HStack justify="space-between">
              <HStack gap={3} align="center">
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="14px"
                  bg="linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 10px 20px rgba(37, 99, 235, 0.25)"
                >
                  <Box as={editingId ? FiEdit2 : FiPlus} fontSize="18px" />
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color="text.muted"
                    textTransform="uppercase"
                    letterSpacing="0.12em"
                  >
                    Task
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color="text.primary">
                    {editingId ? "Edit task" : "Create task"}
                  </Text>
                </Box>
              </HStack>
              <Dialog.CloseTrigger asChild>
                <AppIconButton
                  aria-label="Close"
                  size="sm"
                  w="40px"
                  h="40px"
                >
                  <FiX />
                </AppIconButton>
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>

          <Dialog.Body bg="bg.panel" px={{ base: 6, md: 8 }} pt={6} pb={6}>
            <Stack gap={6}>
              {/* Title */}
              <Field.Root>
                <AppInput
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Task title"
                  fontSize="md"
                  fontWeight="600"
                  h="48px"
                  borderRadius="xl"
                  borderColor={errors?.title ? "red.300" : undefined}
                  _focusVisible={{
                    borderColor: errors?.title ? "red.400" : "blue.400",
                    boxShadow: errors?.title
                      ? "0 0 0 3px rgba(248, 113, 113, 0.2)"
                      : "0 0 0 3px rgba(59, 130, 246, 0.15)",
                  }}
                />
                {errors?.title && (
                  <Text fontSize="xs" color="red.500" mt={2}>
                    {errors.title}
                  </Text>
                )}
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
                  rows={5}
                  borderRadius="xl"
                />
              </Field.Root>

              {/* Two Column Layout */}
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
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

                  {editingId && form.blocked && (
                    <Field.Root>
                      <Field.Label
                        fontSize="xs"
                        fontWeight="600"
                        color="gray.600"
                        mb={2}
                    >
                      BLOCKED REASON (OPTIONAL)
                    </Field.Label>
                      <AppInput
                        name="blockedReason"
                        value={form.blockedReason}
                        onChange={onChange}
                        placeholder="What's blocking this?"
                      />
                      {errors?.blockedReason && (
                        <Text fontSize="xs" color="red.500" mt={2}>
                          {errors.blockedReason}
                        </Text>
                      )}
                    </Field.Root>
                  )}
                </Stack>
              </Grid>

              {/* Subtasks (only after task exists) */}
              {editingId && (
                <Box
                  pt={4}
                  borderTop="1px solid"
                  borderColor="border.muted"
                >
                  <SubtaskList
                    subtasks={form.subtasks}
                    onChange={(subtasks) =>
                      onChange({
                        target: { name: "subtasks", value: subtasks },
                      } as any)
                    }
                  />
                </Box>
              )}

              {/* Blocked Toggle */}
              {editingId && (
                <HStack pt={1}>
                  <AppButton
                    size="sm"
                    variantStyle={form.blocked ? "primary" : "outline"}
                    onClick={() => onToggleBlocked(!form.blocked)}
                    borderRadius="full"
                  >
                    {form.blocked ? "🚫 Blocked" : "Mark as blocked"}
                  </AppButton>
                </HStack>
              )}
            </Stack>
          </Dialog.Body>

          <Dialog.Footer
            bg="bg.panel"
            py={5}
            px={{ base: 6, md: 8 }}
            borderTop="1px solid"
            borderColor="border.muted"
          >
            <HStack w="100%" justify="flex-end" gap={3}>
              <AppButton variantStyle="ghost" onClick={onClose}>
                Cancel
              </AppButton>
              <AppButton
                variantStyle="primary"
                onClick={onSave}
                loading={isSaving}
                disabled={isSaving}
                borderRadius="full"
                px={6}
              >
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
