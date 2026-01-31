import React, { useMemo, useState, useEffect } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Tag,
  Text,
  Textarea,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiColumns,
  FiSearch,
  FiFilter,
  FiAlertCircle
} from "react-icons/fi";

const STORAGE_KEY = "keeper-kanban-v1";

const DEFAULT_CARDS = [
  {
    id: "card-1",
    title: "Design kickoff",
    content: "Define layout, typography, and color system.",
    status: "todo",
    priority: "High",
    blocked: false,
    blockedReason: "",
  },
  {
    id: "card-2",
    title: "Build board",
    content: "Create columns + drag and drop.",
    status: "inprogress",
    priority: "Medium",
    blocked: false,
    blockedReason: "",
  },
  {
    id: "card-3",
    title: "Polish",
    content: "Add modern styling and local storage.",
    status: "done",
    priority: "Low",
    blocked: false,
    blockedReason: "",
  },
];

const COLUMNS = [
  { id: "todo", title: "To Do", hint: "Ideas & incoming work" },
  { id: "inprogress", title: "In Progress", hint: "Focus zone" },
  { id: "done", title: "Complete", hint: "Shipped work" },
];

function App() {
  const toast = useToast();
  const [cards, setCards] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_CARDS;
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_CARDS;
    } catch (error) {
      return DEFAULT_CARDS;
    }
  });
  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "todo",
    priority: "Medium",
    blocked: false,
    blockedReason: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const counts = useMemo(() => {
    return cards.reduce(
      (acc, card) => {
        acc[card.status] += 1;
        return acc;
      },
      { todo: 0, inprogress: 0, done: 0 }
    );
  }, [cards]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBlocked = (event) => {
    const checked = event.target.checked;
    setForm((prev) => ({
      ...prev,
      blocked: checked,
      blockedReason: checked ? prev.blockedReason : "",
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      status: "todo",
      priority: "Medium",
      blocked: false,
      blockedReason: "",
    });
    setEditingId(null);
  };

  const openNewTaskModal = () => {
    resetForm();
    onOpen();
  };

  const openEditModal = (card) => {
    setForm({
      title: card.title,
      content: card.content,
      status: card.status,
      priority: card.priority || "Medium",
      blocked: Boolean(card.blocked),
      blockedReason: card.blockedReason || "",
    });
    setEditingId(card.id);
    onOpen();
  };

  const closeModal = () => {
    onClose();
    resetForm();
  };

  const saveCard = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const content = form.content.trim();
    if (!title && !content) {
      toast({
        title: "Add a title or description.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (form.blocked && !form.blockedReason.trim()) {
      toast({
        title: "Add a reason when marking blocked.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (editingId) {
      setCards((prev) =>
        prev.map((card) =>
          card.id === editingId
            ? {
                ...card,
                title: title || "Untitled",
                content,
                status: form.status,
                priority: form.priority,
                blocked: form.blocked,
                blockedReason: form.blocked ? form.blockedReason.trim() : "",
              }
            : card
        )
      );
      toast({
        title: "Task updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      const newCard = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: title || "Untitled",
        content,
        status: form.status,
        priority: form.priority,
        blocked: form.blocked,
        blockedReason: form.blocked ? form.blockedReason.trim() : "",
      };
      setCards((prev) => [newCard, ...prev]);
      toast({
        title: "Task added.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
    closeModal();
  };

  const removeCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    toast({
      title: "Task removed.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const moveCard = (id, status) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, status } : card))
    );
    const label =
      status === "todo"
        ? "To Do"
        : status === "inprogress"
        ? "In Progress"
        : "Complete";
    toast({
      title: `Moved to ${label}.`,
      status: "info",
      duration: 1500,
      isClosable: true,
    });
  };

  const handleDragStart = (event, id) => {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event, status) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOver(status);
  };

  const handleDrop = (event, status) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (!id) return;
    moveCard(id, status);
    setDragOver(null);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const clearBoard = () => {
    setCards([]);
    toast({
      title: "Board cleared.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="1320px" mx="auto" px={{ base: 4, md: 6 }} py={{ base: 8, md: 10 }}>
      <Box
        bg="white"
        borderRadius={{ base: "2xl", md: "3xl" }}
        border="1px solid"
        borderColor="gray.200"
        boxShadow="xl"
        px={{ base: 5, md: 8 }}
        py={{ base: 6, md: 8 }}
      >
        <Flex
          align="center"
          justify="space-between"
          direction={{ base: "column", md: "row" }}
          gap={6}
          mb={8}
        >
          <HStack spacing={4} align="center">
            <Box
              w="52px"
              h="52px"
              borderRadius="18px"
              bgGradient="linear(to-br, blue.600, blue.400)"
              color="white"
              display="grid"
              placeItems="center"
              boxShadow="lg"
            >
              <FiColumns />
            </Box>
            <Box>
              <Text
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="0.24em"
                color="gray.500"
                fontWeight="700"
              >
                Project
              </Text>
              <Heading size="lg">Product Board</Heading>
              <Text color="gray.500">
                Track work, move cards, and ship updates with clarity.
              </Text>
              <HStack mt={3} spacing={2}>
                <Badge colorScheme="blue" variant="subtle">
                  Active sprint
                </Badge>
                <Badge colorScheme="green" variant="subtle">
                  3 teammates
                </Badge>
              </HStack>
            </Box>
          </HStack>
          <HStack spacing={3}>
            <Button variant="outline" leftIcon={<FiTrash2 />} onClick={clearBoard}>
              Clear board
            </Button>
            <Button colorScheme="blue" leftIcon={<FiPlus />} onClick={openNewTaskModal}>
              Add task
            </Button>
          </HStack>
        </Flex>

        <Stack spacing={4} mb={8}>
          <Grid
            templateColumns={{ base: "1fr", lg: "1.4fr auto auto" }}
            gap={4}
            alignItems="center"
          >
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiSearch />
              </InputLeftElement>
              <Input
                bg="gray.50"
                borderRadius="xl"
                placeholder="Search tasks, tags, or owners"
              />
            </InputGroup>
            <HStack spacing={3} justify={{ base: "flex-start", lg: "center" }}>
              <Button size="sm" variant="outline" leftIcon={<FiFilter />}>
                Priority
              </Button>
              <Button size="sm" variant="outline" leftIcon={<FiAlertCircle />}>
                Blocked
              </Button>
            </HStack>
            <Box />
          </Grid>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
            <Box bg="gray.50" borderRadius="xl" p={3} border="1px solid" borderColor="gray.200">
              <Text fontSize="xs" color="gray.500" fontWeight="600">
                TOTAL
              </Text>
              <Heading size="md">{cards.length}</Heading>
            </Box>
            <Box bg="blue.50" borderRadius="xl" p={3} border="1px solid" borderColor="blue.100">
              <Text fontSize="xs" color="blue.600" fontWeight="600">
                TO DO
              </Text>
              <Heading size="md" color="blue.700">
                {counts.todo}
              </Heading>
            </Box>
            <Box bg="purple.50" borderRadius="xl" p={3} border="1px solid" borderColor="purple.100">
              <Text fontSize="xs" color="purple.600" fontWeight="600">
                IN PROGRESS
              </Text>
              <Heading size="md" color="purple.700">
                {counts.inprogress}
              </Heading>
            </Box>
            <Box bg="green.50" borderRadius="xl" p={3} border="1px solid" borderColor="green.100">
              <Text fontSize="xs" color="green.600" fontWeight="600">
                DONE
              </Text>
              <Heading size="md" color="green.700">
                {counts.done}
              </Heading>
            </Box>
          </SimpleGrid>
        </Stack>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={4}>
        {COLUMNS.map((column) => (
          <Box
            key={column.id}
            bg="gray.50"
            border="1px solid"
            borderColor={dragOver === column.id ? "blue.300" : "gray.200"}
            borderRadius="2xl"
            p={4}
            minH="560px"
            onDragOver={(event) => handleDragOver(event, column.id)}
            onDrop={(event) => handleDrop(event, column.id)}
            onDragLeave={handleDragLeave}
          >
            <Flex align="flex-start" justify="space-between" mb={4}>
              <Box>
                <HStack spacing={2}>
                  <Box
                    w="10px"
                    h="10px"
                    borderRadius="full"
                    bg={
                      column.id === "todo"
                        ? "blue.400"
                        : column.id === "inprogress"
                        ? "purple.400"
                        : "green.400"
                    }
                  />
                  <Heading size="sm">{column.title}</Heading>
                </HStack>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {column.hint}
                </Text>
              </Box>
              <Badge borderRadius="full" px={2}>
                {counts[column.id]}
              </Badge>
            </Flex>

            <Stack spacing={3}>
              {cards
                .filter((card) => card.status === column.id)
                .map((card) => (
                  <Box
                    key={card.id}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    p={4}
                    boxShadow="sm"
                    draggable
                    onDragStart={(event) => handleDragStart(event, card.id)}
                  >
                    <Flex align="center" justify="space-between" mb={2}>
                      <Heading size="sm">{card.title}</Heading>
                      <HStack spacing={2}>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={<FiEdit2 />}
                          aria-label="Edit task"
                          onClick={() => openEditModal(card)}
                        />
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={<FiTrash2 />}
                          aria-label="Remove task"
                          onClick={() => removeCard(card.id)}
                        />
                      </HStack>
                    </Flex>
                    {card.content && (
                      <Text fontSize="sm" color="gray.600" mb={3}>
                        {card.content}
                      </Text>
                    )}
                    <HStack spacing={2} mb={2} flexWrap="wrap">
                      <Tag
                        colorScheme={
                          card.priority === "High"
                            ? "red"
                            : card.priority === "Medium"
                            ? "orange"
                            : "blue"
                        }
                      >
                        {card.priority}
                      </Tag>
                      {card.blocked && (
                        <Tag colorScheme="purple">Blocked</Tag>
                      )}
                    </HStack>
                    {card.blocked && card.blockedReason && (
                      <Box
                        bg="purple.50"
                        borderRadius="md"
                        p={2}
                        fontSize="xs"
                        color="purple.700"
                      >
                        {card.blockedReason}
                      </Box>
                    )}
                    <Box borderTop="1px solid" borderColor="gray.200" my={3} />
                    <HStack spacing={2} flexWrap="wrap">
                      {column.id !== "todo" && (
                        <Button
                          size="xs"
                          variant="link"
                          colorScheme="blue"
                          onClick={() => moveCard(card.id, "todo")}
                        >
                          Move to To Do
                        </Button>
                      )}
                      {column.id !== "inprogress" && (
                        <Button
                          size="xs"
                          variant="link"
                          colorScheme="purple"
                          onClick={() => moveCard(card.id, "inprogress")}
                        >
                          Move to In Progress
                        </Button>
                      )}
                      {column.id !== "done" && (
                        <Button
                          size="xs"
                          variant="link"
                          colorScheme="green"
                          onClick={() => moveCard(card.id, "done")}
                        >
                          Move to Complete
                        </Button>
                      )}
                    </HStack>
                  </Box>
                ))}
              {cards.filter((card) => card.status === column.id).length === 0 && (
                <Box
                  border="1px dashed"
                  borderColor="gray.300"
                  borderRadius="xl"
                  p={6}
                  textAlign="center"
                  color="gray.500"
                  bg="white"
                >
                  <Text fontWeight="600">Drop cards here</Text>
                  <Text fontSize="sm">No notes yet.</Text>
                </Box>
              )}
            </Stack>
          </Box>
        ))}
      </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={closeModal} size="2xl" motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent borderRadius="2xl" overflow="hidden" maxW="900px" boxShadow="2xl">
          <ModalHeader bg="gray.50" py={3}>
            <HStack spacing={3}>
              <Box
                w="34px"
                h="34px"
                borderRadius="10px"
                bgGradient="linear(to-br, blue.600, blue.400)"
                color="white"
                display="grid"
                placeItems="center"
              >
                <FiColumns />
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="600" letterSpacing="0.08em" textTransform="uppercase">
                  Task editor
                </Text>
                <Heading size="md">
                  {editingId ? "Edit task" : "New task"}
                </Heading>
              </Box>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bg="white" px={{ base: 6, md: 8 }} py={{ base: 6, md: 8 }}>
            <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={5}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.600">
                    Title
                  </FormLabel>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={updateForm}
                    placeholder="Add a task title"
                    size="md"
                    borderRadius="lg"
                    bg="gray.50"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.600">
                    Description
                  </FormLabel>
                  <Textarea
                    name="content"
                    value={form.content}
                    onChange={updateForm}
                    placeholder="Add details, links, or next steps."
                    rows={7}
                    size="md"
                    borderRadius="lg"
                    bg="gray.50"
                  />
                </FormControl>
              </Stack>
              <Stack
                spacing={4}
                bg="gray.50"
                borderRadius="xl"
                p={4}
                border="1px solid"
                borderColor="gray.200"
              >
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.600">
                    Priority
                  </FormLabel>
                  <Select
                    name="priority"
                    value={form.priority}
                    onChange={updateForm}
                    size="md"
                    borderRadius="lg"
                    bg="white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.600">
                    Status
                  </FormLabel>
                  <Select
                    name="status"
                    value={form.status}
                    onChange={updateForm}
                    size="md"
                    borderRadius="lg"
                    bg="white"
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Complete</option>
                  </Select>
                </FormControl>
                <Divider />
                <FormControl>
                  <HStack justify="space-between">
                    <FormLabel fontSize="sm" color="gray.600" mb={0}>
                      Blocked
                    </FormLabel>
                    <Switch
                      colorScheme="purple"
                      isChecked={form.blocked}
                      onChange={toggleBlocked}
                    />
                  </HStack>
                  {form.blocked && (
                    <Input
                      mt={3}
                      name="blockedReason"
                      value={form.blockedReason}
                      onChange={updateForm}
                      placeholder="Reason"
                      size="md"
                      borderRadius="lg"
                      bg="white"
                    />
                  )}
                </FormControl>
              </Stack>
            </Grid>
          </ModalBody>
          <ModalFooter
            bg="gray.50"
            py={4}
            px={{ base: 6, md: 8 }}
            mt={4}
            borderTop="1px solid"
            borderColor="gray.200"
          >
            <HStack w="100%" justify="flex-end" spacing={3}>
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={saveCard}>
                {editingId ? "Save changes" : "Create task"}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
