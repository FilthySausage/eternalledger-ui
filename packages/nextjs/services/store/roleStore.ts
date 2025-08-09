import { create } from "zustand";

export type PortalRole = "hospital" | "user" | null;

interface RoleState {
  role: PortalRole;
  setRole: (role: PortalRole) => void;
}

export const useRoleStore = create<RoleState>(set => ({
  role: null,
  setRole: role => set({ role }),
}));
