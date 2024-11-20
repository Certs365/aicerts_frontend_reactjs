// store.js
import {create} from "zustand";

type Store = {
  paperSize: "A4" | "US Letter"; // Store for paper size
  orientation: "Portrait" | "Landscape"; // Store for orientation
  setPaperSize: (size: "A4" | "US Letter") => void;
  setOrientation: (orientation: "Portrait" | "Landscape") => void;
};

export const useCanvasStore = create<Store>((set) => ({
  paperSize: "A4",
  orientation: "Portrait",
  setPaperSize: (size) => set({ paperSize: size }),
  setOrientation: (orientation) => set({ orientation }),
}));
