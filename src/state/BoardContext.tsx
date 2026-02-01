import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Card, Status } from "@/types";
import { useBoardStore } from "@/state/BoardStore";

const getStorageKey = (boardId: string | null) =>
  boardId ? `keeper-cards-${boardId}` : "keeper-cards-default";

type State = {
  cards: Card[];
};

type Action =
  | { type: "ADD"; payload: Card }
  | { type: "UPDATE"; payload: Card }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "MOVE"; payload: { id: string; status: Status } }
  | { type: "CLEAR" };

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
  if (!stored) return { cards: DEFAULT_CARDS };
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
    return { cards };
  } catch {
    return { cards: DEFAULT_CARDS };
  }
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD":
      return { cards: [action.payload, ...state.cards] };
    case "UPDATE":
      return {
        cards: state.cards.map((card) =>
          card.id === action.payload.id ? action.payload : card,
        ),
      };
    case "REMOVE":
      return {
        cards: state.cards.filter((card) => card.id !== action.payload.id),
      };
    case "MOVE":
      return {
        cards: state.cards.map((card) =>
          card.id === action.payload.id
            ? { ...card, status: action.payload.status }
            : card,
        ),
      };
    case "CLEAR":
      return { cards: [] };
    default:
      return state;
  }
};

type BoardContextValue = {
  cards: Card[];
  counts: Record<Status, number>;
  addCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  removeCard: (id: string) => void;
  moveCard: (id: string, status: Status) => void;
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
  }, [activeBoardId]);

  useEffect(() => {
    const STORAGE_KEY = getStorageKey(activeBoardId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cards));
  }, [state.cards]);

  const counts = useMemo(() => {
    return state.cards.reduce(
      (acc, card) => {
        acc[card.status] += 1;
        return acc;
      },
      { todo: 0, inprogress: 0, done: 0 },
    );
  }, [state.cards]);

  const addCard = (card: Card) => {
    dispatch({ type: "ADD", payload: card });
  };

  const updateCard = (card: Card) => {
    dispatch({ type: "UPDATE", payload: card });
  };

  const removeCard = (id: string) => {
    dispatch({ type: "REMOVE", payload: { id } });
  };

  const moveCard = (id: string, status: Status) => {
    dispatch({ type: "MOVE", payload: { id, status } });
  };

  const clearBoard = () => {
    dispatch({ type: "CLEAR" });
  };

  return (
    <BoardContext.Provider
      value={{
        cards: state.cards,
        counts,
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
