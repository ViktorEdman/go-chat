import { create } from "zustand";

interface ChatState {
  messages: string[],
  sendMessage: (message: string) => void,
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sendMessage: (message: string) => set((state: ChatState) => ({ messages: [...state.messages, message] })),
}))

export default useChatStore
