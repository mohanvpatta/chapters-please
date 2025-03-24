import { generateRandomId, isValidChapters, initialChapters } from "./utils";
import type { Chapter } from "./types";

class Store {
  video: HTMLVideoElement | null = $state(null);
  isPlaying = $state(false);
  current = $state(0);
  updatedChapterId = $state(null) as string | null;
  chapters = $state<Chapter[]>(initialChapters);
  ambience = $state(true);

  message = $state(null) as string | null;

  x = $state(100);
  y = $state(150);

  constructor() {
    const saved = localStorage.getItem("chapters-please");
    try {
      if (saved) {
        const parsedChapters = JSON.parse(saved);

        if (isValidChapters(parsedChapters)) {
          this.chapters = parsedChapters;
        }
      }
    } catch (e) {
      console.error("Failed to parse chapters from localStorage:", e);
    }
  }

  backupChapters() {
    localStorage.setItem("backup-please", JSON.stringify(this.chapters));
  }

  clearChapters() {
    this.backupChapters();
    this.chapters = initialChapters;
  }

  retrieveChapters() {
    const backup = localStorage.getItem("backup-please");
    if (backup) {
      const parsedChapters = JSON.parse(backup);

      if (isValidChapters(parsedChapters)) {
        this.chapters = parsedChapters;
      }
    }
  }

  togglePlay() {
    if (this.video) {
      if (this.video.paused) {
        this.video.play();
      } else {
        this.video.pause();
      }
    }
  }

  rewind() {
    if (this.video) {
      this.video.currentTime -= 10;
    }
  }

  forward() {
    if (this.video) {
      this.video.currentTime += 10;
    }
  }

  seek(time: number) {
    if (this.video) {
      this.video.currentTime = time;
    }
  }

  addChapter() {
    let id = generateRandomId(10);
    if (this.video) {
      this.chapters.push({
        time: this.video.currentTime,
        title: "",
        id,
      });

      this.sortChapters();
    }

    this.updatedChapterId = id;
  }

  deleteChapter(id: string) {
    this.chapters = this.chapters.filter((chapter) => chapter.id !== id);
  }

  sortChapters() {
    this.chapters.sort((a, b) => {
      if (a.id === "required-chapter") return -1;
      if (b.id === "required-chapter") return 1;
      return a.time - b.time;
    });
  }
}

export const store = new Store();
