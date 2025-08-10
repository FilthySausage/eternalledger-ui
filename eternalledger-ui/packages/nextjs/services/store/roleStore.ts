import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PortalRole = "hospital" | "user" | null;

interface RoleState {
  role: PortalRole;
  setRole: (role: PortalRole) => void;
  clearRole: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    set => ({
      role: null,
      setRole: role => set({ role }),
      clearRole: () => set({ role: null }),
    }),
    {
      name: "eternal-ledger-role",
    },
  ),
);
