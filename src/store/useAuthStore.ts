import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

interface User {
  id: number;
  email: string;
  name: string;
  accountType: "USER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const TOKEN_KEY = "moca-auth-token";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  isAdmin: false,

  login: async (token: string, user: User) => {
    if (Platform.OS !== "web") {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
    set({
      user,
      token,
      isLoggedIn: true,
      isAdmin: user.accountType === "ADMIN",
    });
  },

  logout: async () => {
    if (Platform.OS !== "web") {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    set({
      user: null,
      token: null,
      isLoggedIn: false,
      isAdmin: false,
    });
  },

  restoreSession: async () => {
    let token: string | null = null;
    if (Platform.OS !== "web") {
      token = await SecureStore.getItemAsync(TOKEN_KEY);
    }

    // In a real app, you would validate the token with the backend here
    // For now, we just check if a token exists. Since we don't persist user info,
    // we would typically fetch /auth/me here.
    // I will add a placeholder for fetching user info later.

    if (token) {
      set({ token, isLoggedIn: true });
      // Trigger fetch user action if needed (not implemented yet)
    }
  },
}));
