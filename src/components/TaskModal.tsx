import React from "react";
import {
  Box,
  Dialog,
  Field,
  Grid,
  Heading,
  HStack,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiColumns } from "react-icons/fi";
import type { Priority, Status } from "../types";
import { AppButton, AppInput, AppSelect, AppTextarea } from "@/ui";

type FormState = {
  title: string;
  content: string;
  status: Status;
  priority: Priority;
  blocked: boolean;
  blockedReason: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: React.FormEvent) => void;
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
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          borderRadius="2xl"
          overflow="hidden"
          maxW="900px"
          boxShadow="2xl"
        >
          <Dialog.Header
            bg="white"
            py={5}
            px={{ base: 6, md: 8 }}
            pr={{ base: 14, md: 16 }}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <HStack gap={3} alignItems="center">
              <Box
                w="40px"
                h="40px"
                borderRadius="lg"
                bgGradient="linear(to-br, blue.500, blue.600)"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="lg"
                flexShrink={0}
              >
                <FiColumns />
              </Box>
              <Box flex="1">
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontWeight="500"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  mb={0.5}
                >
                  Task editor
                </Text>
                <Heading size="lg" fontWeight="600" color="gray.900">
                  {editingId ? "Edit task" : "New task"}
                </Heading>
              </Box>
            </HStack>
            <Dialog.CloseTrigger position="absolute" right="16px" top="16px" />
          </Dialog.Header>
          <Dialog.Body bg="white" px={{ base: 6, md: 8 }} pt={6} pb={8}>
            <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={6}>
              <Stack gap={4}>
                <Field.Root>
                  <Field.Label fontSize="sm" color="gray.600">
                    Title
                  </Field.Label>
                  <AppInput
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    placeholder="Add a task title"
                    size="md"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label fontSize="sm" color="gray.600">
                    Description
                  </Field.Label>
                  <AppTextarea
                    name="content"
                    value={form.content}
                    onChange={onChange}
                    placeholder="Add details, links, or next steps."
                    rows={7}
                    size="md"
                  />
                </Field.Root>
              </Stack>
              <Stack
                gap={4}
                bg="gray.50"
                borderRadius="xl"
                p={5}
                border="1px solid"
                borderColor="gray.200"
              >
                <Field.Root>
                  <Field.Label fontSize="sm" color="gray.600">
                    Priority
                  </Field.Label>
                  <AppSelect
                    name="priority"
                    value={form.priority}
                    onChange={onChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </AppSelect>
                </Field.Root>
                <Field.Root>
                  <Field.Label fontSize="sm" color="gray.600">
                    Status
                  </Field.Label>
                  <AppSelect
                    name="status"
                    value={form.status}
                    onChange={onChange}
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Complete</option>
                  </AppSelect>
                </Field.Root>
                <Separator />
                <Field.Root>
                  <HStack justify="space-between">
                    <Field.Label fontSize="sm" color="gray.600" mb={0}>
                      Blocked
                    </Field.Label>
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
                      {form.blocked ? "Blocked" : "Not blocked"}
                    </AppButton>
                  </HStack>
                  {form.blocked && (
                    <AppInput
                      mt={3}
                      name="blockedReason"
                      value={form.blockedReason}
                      onChange={onChange}
                      placeholder="Reason"
                      size="md"
                    />
                  )}
                </Field.Root>
              </Stack>
            </Grid>
          </Dialog.Body>
          <Dialog.Footer
            bg="white"
            pt={4}
            pb={6}
            px={{ base: 6, md: 8 }}
            borderTop="1px solid"
            borderColor="gray.100"
          >
            <HStack w="100%" justify="flex-end" gap={3}>
              <AppButton variantStyle="ghost" onClick={onClose}>
                Cancel
              </AppButton>
              <AppButton variantStyle="primary" onClick={onSave}>
                {editingId ? "Save changes" : "Create task"}
              </AppButton>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default TaskModal;
