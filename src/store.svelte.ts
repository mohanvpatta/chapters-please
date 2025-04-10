import { generateRandomId, initialChapters, isValidChapters } from "./utils";

export type ChapterType = {
  timestamp: number;
  title: string;
  id: string;
};

class Store {
  video: HTMLVideoElement | null = $state(null);
  isPlaying: boolean = $state(false);
  current = $state(0);
  chapters: ChapterType[] = $state(initialChapters);
  updatedChapterId = $state(null) as string | null;
  ambience = $state(true);
  message = $state(null) as string | null;

  right = $state(20);
  bottom = $state(20);

  constructor() {
    try {
      const saved = localStorage.getItem("chapters-please");
      if (saved) {
        const parsedChapters = JSON.parse(saved) as ChapterType[];
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
      const parsedChapters = JSON.parse(backup) as ChapterType[];

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
        timestamp: this.video.currentTime,
        title: "",
        id,
      });

      this.sortChapters();
    }

    this.updatedChapterId = id;
  }

  removeChapter(id: string) {
    this.chapters = this.chapters.filter((chapter) => chapter.id !== id);
  }

  sortChapters() {
    this.chapters.sort((a, b) => {
      if (a.id === "required-chapter") return -1;
      if (b.id === "required-chapter") return 1;
      return a.timestamp - b.timestamp;
    });
  }
}

export const store = new Store();
