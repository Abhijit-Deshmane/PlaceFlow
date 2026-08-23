import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface TokenCache {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => Promise<void>;
}

const createTokenCache = (): TokenCache => {
  return {
    async getToken(key: string) {
      try {
        if (Platform.OS === "web") {
          return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
      } catch (err) {
        console.error("[TokenCache] Error reading token:", err);
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        if (Platform.OS === "web") {
          localStorage.setItem(key, value);
          return;
        }
        await SecureStore.setItemAsync(key, value);
      } catch (err) {
        console.error("[TokenCache] Error saving token:", err);
      }
    },
    async clearToken(key: string) {
      try {
        if (Platform.OS === "web") {
          localStorage.removeItem(key);
          return;
        }
        await SecureStore.deleteItemAsync(key);
      } catch (err) {
        console.error("[TokenCache] Error deleting token:", err);
      }
    },
  };
};

export const tokenCache = createTokenCache();
