import type { Card } from "@/types";

export type ExportData = {
  version: string;
  exportedAt: string;
  boardId: string;
  boardName: string;
  cards: Card[];
  tags?: Array<{ id: string; label: string; color: string; icon: string }>;
  assignees?: Array<{ id: string; name: string; avatar?: string }>;
};

export const exportBoardToJSON = (
  boardId: string,
  boardName: string,
  cards: Card[],
  tags?: any[],
  assignees?: any[],
): void => {
  const exportData: ExportData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    boardId,
    boardName,
    cards,
    tags,
    assignees,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${boardName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importBoardFromJSON = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        // Validate data structure
        if (!data.version || !data.cards || !Array.isArray(data.cards)) {
          throw new Error("Invalid export file format");
        }

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
