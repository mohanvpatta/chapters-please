import type { ChapterType } from "./store.svelte";

export let initialChapters: ChapterType[] = [
  {
    timestamp: 0,
    title: "Click to rename",
    id: "required-chapter",
  },
];

export function getTimestamp(timestamp: number) {
  const hours = Math.floor(timestamp / 3600);
  const minutes = Math.floor((timestamp % 3600) / 60);
  const seconds = Math.floor(timestamp % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function generateRandomId(length: number) {
  if (length < 1) return "";

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const alphanumerics =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  // First character is always a letter
  let id = letters.charAt(Math.floor(Math.random() * letters.length));

  // Append the remaining characters (length - 1) from the alphanumerics
  for (let i = 1; i < length; i++) {
    id += alphanumerics.charAt(
      Math.floor(Math.random() * alphanumerics.length)
    );
  }

  return id;
}

export function isValidChapters(
  data: any
): data is Array<{ time: number; title: string; id: string }> {
  if (!Array.isArray(data)) return false;
  return data.every(
    (chapter) =>
      typeof chapter.timestamp === "number" &&
      typeof chapter.title === "string" &&
      typeof chapter.id === "string"
  );
}

export function didStateChangeAfterClear(chapters: ChapterType[]) {
  if (JSON.stringify(chapters) === JSON.stringify(initialChapters)) {
    return false;
  }
  return true;
}
