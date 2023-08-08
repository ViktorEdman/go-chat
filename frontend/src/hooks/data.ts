import { create } from "zustand";

interface ChatState {
  messages: string[],
  setUserName: (name: string) => void,
  sendMessage: (message: string) => void,
  userName: string
}

export const useChatStore = create<ChatState>((set) => ({
  userName: "",
  setUserName: (name: string) => set(() => ({ userName: name })),
  messages: [],
  sendMessage: (message: string) => set((state: ChatState) => ({ messages: [...state.messages, message] })),
}))

export default useChatStore
