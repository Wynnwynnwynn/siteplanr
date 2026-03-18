import { create } from 'zustand';
import { CATALOGUE, normalizedYaw } from './utils.js';

export const useStore = create((set, get) => ({
  // --- Items ---
  items: [],
  addItem: (type, pos = [0, 0, 0]) => {
    const def = CATALOGUE[type];
    if (!def) return;
    set(s => ({
      items: [...s.items, {
        id: crypto.randomUUID(),
        type,
        dims: def.dims,
        yaw: s.placingType ? s.ghostYaw : 0,
        pos,
      }]
    }));
  },
  updateItem: (id, patch) => set(s => ({
    items: s.items.map(it => it.id === id ? { ...it, ...patch } : it)
  })),
  removeItem: (id) => set(s => ({ items: s.items.filter(it => it.id !== id) })),
  clearItems: () => set({ items: [] }),

  // --- Selection ---
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),

  // --- Placement mode ---
  placingType: null,
  setPlacingType: (type) => set({ placingType: type, ghostPos: null, ghostYaw: 0 }),
  cancelPlacing: () => set({ placingType: null, ghostPos: null }),

  // --- Ghost position during placement ---
  ghostPos: null,
  ghostYaw: 0,
  setGhostPos: (pos) => set({ ghostPos: pos }),
  setGhostYaw: (yaw) => set({ ghostYaw: yaw }),

  // --- Grid snap ---
  gridStep: 1,
  cycleGridStep: () => set(s => ({
    gridStep: s.gridStep === 1 ? 0.5 : s.gridStep === 0.5 ? 0.25 : 1
  })),

  // --- Dragging (move existing items) ---
  draggingId: null,
  setDraggingId: (id) => set({ draggingId: id }),

  // --- Cart ---
  cartPlatform: 'generic',
  setCartPlatform: (p) => set({ cartPlatform: p }),
  cartPreview: null,
  setCartPreview: (payload) => set({ cartPreview: payload }),
  closeCart: () => set({ cartPreview: null }),
}));
