import { create } from "zustand";
import { persist } from "zustand/middleware";

type LayoutState = {
  sidebarCollapsed: boolean;

  toggleSidebar: () => void;

  collapseSidebar: () => void;

  expandSidebar: () => void;
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      collapseSidebar: () =>
        set({
          sidebarCollapsed: true,
        }),

      expandSidebar: () =>
        set({
          sidebarCollapsed: false,
        }),
    }),
    {
      name: "layout-storage",
    }
  )
);