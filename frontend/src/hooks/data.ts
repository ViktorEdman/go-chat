import { create } from "zustand";

interface ChatState {
  messages: string[],
  sendMessage: (message: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sendMessage: (message) => set((state) => ({ messages: [...state.messages, message] }))
}))

export default useChatStore
