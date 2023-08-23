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

interface SocketState {
  socket: WebSocket | null
  connected: boolean
  setConnected: (connected: boolean) => void
  connect: () => void
}

export const useChatStore = create<SocketState & ChatState>((set) => ({
  socket: null,
  connected: false,
  setConnected: (connected: boolean) => set(() => ({ connected: connected })),
  connect: () => set((state) => {
    if (state.socket === null) {
      const protocol = location.protocol === "https:" ? 'wss://' : "ws://"
      const ws = new WebSocket(protocol + location.host + "/ws")
      ws.addEventListener("open", () => {
        state.setConnected(true)
      })
      ws.addEventListener("close", () => {
        state.setConnected(false)
        setTimeout(() => state.connect(), 1000)
      })
      ws.addEventListener("message", (event) => {
        state.receiveMessage(event.data)
        console.log(event.data)
      })
      return { socket: ws }
    }
    return state
  }),
  userName: "",
  setUserName: (name: string) => set(() => ({ userName: name })),
  message: "",
  setMessage: (message: string) => set(() => ({ message: message })),
  messages: [],
  receiveMessage: (message: string) => set((state: ChatState) => ({ messages: [...state.messages, message] })),
  sendMessage: () => set((state: ChatState) => ({ messages: [...state.messages, state.message] })),
}))
export default useChatStore
