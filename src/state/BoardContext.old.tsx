import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { Card, Status } from "@/types";
import { useBoardStore } from "@/state/BoardStore";
import { apiClient } from "@/config/api";

const getStorageKey = (boardId: string | null) =>
  boardId ? `keeper-cards-${boardId}` : "keeper-cards-default";

type State = {
  cards: Card[];
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: "SET_CARDS"; payload: Card[] }
  | { type: "ADD"; payload: Card }
  | { type: "UPDATE"; payload: Card }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "MOVE"; payload: { id: string; status: Status } }
  | { type: "CLEAR" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const DEFAULT_CARDS: Card[] = [
  {
    id: "card-1",
    title: "Design kickoff",
    content: "Define layout, typography, and color system.",
    status: "todo",
    priority: "High",
    blocked: false,
    blockedReason: "",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tags: [],
    assigneeId: "",
    subtasks: [],
    comments: [],
    activities: [
      {
        id: "activity-1",
        type: "created",
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "card-2",
    title: "Build board",
    content: "Create columns + drag and drop.",
    status: "inprogress",
    priority: "Medium",
    blocked: false,
    blockedReason: "",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tags: [],
    assigneeId: "",
    subtasks: [],
    comments: [],
    activities: [
      {
        id: "activity-2",
        type: "created",
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "card-3",
    title: "Polish",
    content: "Add modern styling and local storage.",
    status: "done",
    priority: "Low",
    blocked: false,
    blockedReason: "",
    dueDate: "",
    tags: [],
    assigneeId: "",
    subtasks: [],
    comments: [],
    activities: [
      {
        id: "activity-3",
        type: "created",
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialState = (boardId: string | null): State => {
  const STORAGE_KEY = getStorageKey(boardId);
  const stored = localStorage.getItem(STORAGE_KEY);
  const baseState: State = { 
    cards: [], 
    isLoading: false, 
    error: null 
  };
  
  if (!stored) return { ...baseState, cards: DEFAULT_CARDS };
  
  try {
    const parsed = JSON.parse(stored);
    // Migrate old cards to include new fields
    const cards = Array.isArray(parsed)
      ? parsed.map((card: any) => ({
          ...card,
          dueDate: card.dueDate || "",
          tags: card.tags || [],
          assigneeId: card.assigneeId || "",
          subtasks: card.subtasks || [],
          comments: card.comments || [],
          activities: card.activities || [
            {
              id: `activity-${Date.now()}`,
              type: "created" as const,
              timestamp: card.createdAt || new Date().toISOString(),
            },
          ],
          createdAt: card.createdAt || new Date().toISOString(),
          updatedAt: card.updatedAt || new Date().toISOString(),
        }))
      : DEFAULT_CARDS;
    return { ...baseState, cards };
  } catch {
    return { ...baseState, cards: DEFAULT_CARDS };
  }
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CARDS":
      return { ...state, cards: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD":
      return { ...state, cards: [action.payload, ...state.cards] };
    case "UPDATE":
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.id ? action.payload : card,
        ),
      };
    case "REMOVE":
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== action.payload.id),
      };
    case "MOVE":
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.id
            ? { ...card, status: action.payload.status }
            : card,
        ),
      };
    case "CLEAR":
      return { ...state, cards: [] };
    default:
      return state;
  }
};

type BoardContextValue = {
  cards: Card[];
  counts: Record<Status, number>;
  isLoading: boolean;
  error: string | null;
  fetchCards: () => Promise<void>;
  addCard: (card: Card) => Promise<void>;
  updateCard: (card: Card) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
  moveCard: (id: string, status: Status) => Promise<void>;
  clearBoard: () => void;
};

const BoardContext = createContext<BoardContextValue | null>(null);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { activeBoardId } = useBoardStore();
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(activeBoardId),
  );

  // Re-initialize state when active board changes
  useEffect(() => {
    const newState = initialState(activeBoardId);
    dispatch({ type: "CLEAR" });
    newState.cards.forEach((card) => {
      dispatch({ type: "ADD", payload: card });
    });
    // Fetch cards from API when board changes
    fetchCards();
  }, [activeBoardId]);

  useEffect(() => {
    const STORAGE_KEY = getStorageKey(activeBoardId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cards));
  }, [state.cards, activeBoardId]);

  const counts = useMemo(() => {
    return state.cards.reduce(
      (acc, card) => {
        acc[card.status] += 1;
        return acc;
      },
      { todo: 0, inprogress: 0, done: 0 },
    );
  }, [state.cards]);

  const fetchCards = async () => {
    if (!activeBoardId) return;
    
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    try {
      const cards = await apiClient.get(`/tasks?boardId=${activeBoardId}`);
      dispatch({ type: "SET_CARDS", payload: cards });
    } catch (error: any) {
      console.error("Failed to fetch tasks:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addCard = async (card: Card) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const newCard = await apiClient.post("/tasks", {
        ...card,
        boardId: activeBoardId,
      });
      dispatch({ type: "ADD", payload: newCard });
    } catch (error: any) {
      console.error("Failed to add task:", error);
      dispatch({ type: "ADD", payload: card });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateCard = async (card: Card) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const updatedCard = await apiClient.put(`/tasks/${card.id}`, card);
      dispatch({ type: "UPDATE", payload: updatedCard });
    } catch (error: any) {
      console.error("Failed to update task:", error);
      dispatch({ type: "UPDATE", payload: card });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeCard = async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await apiClient.delete(`/tasks/${id}`);
      dispatch({ type: "REMOVE", payload: { id } });
    } catch (error: any) {
      console.error("Failed to remove task:", error);
      dispatch({ type: "REMOVE", payload: { id } });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const moveCard = async (id: string, status: Status) => {
    dispatch({ type: "MOVE", payload: { id, status } });

    try {
      await apiClient.patch(`/tasks/${id}`, { status });
    } catch (error: any) {
      console.error("Failed to move task:", error);
    }
  };

  const clearBoard = () => {
    dispatch({ type: "CLEAR" });
  };

  return (
    <BoardContext.Provider
      value={{
        cards: state.cards,
        counts,
        isLoading: state.isLoading,
        error: state.error,
        fetchCards,
        addCard,
        updateCard,
        removeCard,
        moveCard,
        clearBoard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) throw new Error("useBoard must be used within BoardProvider");
  return context;
};
