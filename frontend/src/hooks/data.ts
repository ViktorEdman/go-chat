import { create } from "zustand";

interface ChatState {
  messages: string[],
  setUserName: (name: string) => void,
  sendMessage: (message: string) => void,
  userName: string,
  message: string,
  setMessage: (message: string) => void
  receiveMessage: (message: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  userName: "",
  setUserName: (name: string) => set(() => ({ userName: name })),
  message: "",
  setMessage: (message: string) => set(() => ({ message: message })),
  messages: [],
  receiveMessage: (message: string) => set((state: ChatState) => ({ messages: [...state.messages, message] })),
  sendMessage: () => set((state: ChatState) => ({ messages: [...state.messages, state.message] })),
}))

export default useChatStore
