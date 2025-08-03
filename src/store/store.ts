import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Timeframe } from "@/types/dashboard";

type User = {
  data: {
    uid: string;
    username: string;
    name: string;
    company: string;
  };
  token: string;
};

export type UserStore = {
  user: User | null;
  fcmToken: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setToken: (token: string) => void;
  clearToken: () => void;
  setFcmToken: (fcmToken: string) => void;
  clearFcmToken: () => void;
};

export type AppStore = {
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
};

export type ThemeStore = {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
};

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "themeStore",
    }
  )
);

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      fcmToken: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
      setToken: (token: string) =>
        set((state) => {
          if (state.user) {
            return { user: { ...state.user, token } };
          }
          return state;
        }),
      clearToken: () =>
        set((state) => {
          if (state.user) {
            return { user: { ...state.user, token: "" } };
          }
          return state;
        }),
      setFcmToken: (fcmToken: string) =>
        set((state) => {
          if (state.user) {
            return { user: { ...state.user, fcmToken } };
          }
          return state;
        }),
      clearFcmToken: () =>
        set((state) => {
          if (state.user) {
            return { user: { ...state.user, fcmToken: "" } };
          }
          return state;
        }),
    }),
    {
      name: "userStore",
    }
  )
);

const useAppStore = create<AppStore>((set) => ({
  timeframe: {
    value: "1D",
    label: "1 Day",
  },
  setTimeframe: (timeframe: Timeframe) => set({ timeframe }),
}));

export { useUserStore, useThemeStore, useAppStore };
export type { User }; 