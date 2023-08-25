import { create } from "zustand";

interface ChatState {
  messages: string[],
  setUserName: (name: string) => void,
  sendMessage: (message: string) => void,
  userName: string,
  message: string,
  setMessage: (data: string) => void
  receiveMessage: (message: string) => void
}

interface SocketState {
  socket: WebSocket | null
  connected: boolean
  setConnected: (connected: boolean) => void
  connect: () => void
  disconnect: () => void
}

export const useChatStore = create<SocketState & ChatState>((set, get) => ({
  socket: null,
  connected: false,
  setConnected: (connected: boolean) => set(() => ({ connected: connected })),
  connect: () => set((state) => {
    const protocol = location.protocol === "https:" ? 'wss://' : "ws://"
    const ws = new WebSocket(protocol + location.host + "/ws")
    ws.addEventListener("open", () => {
      state.setConnected(true)
    })
    ws.addEventListener("close", () => {
      state.setConnected(false)
    })
    ws.addEventListener("message", (event) => {
      state.receiveMessage(event.data)
      console.log(event.data)
    })
    return { socket: ws }
  }),
  disconnect: () => set((state) => {
    state.socket && state.socket.close()
    return { socket: null, connected: false }
  }),
  userName: "",
  setUserName: (name: string) => set(() => ({ userName: name })),
  message: "",
  setMessage: (message: string) => set(() => ({ message: message })),
  messages: [],
  receiveMessage: (data: string) => set((state: ChatState) => {
    const { message, userName } = JSON.parse(data);
    return { messages: [...state.messages, `${userName}: ${message}`] }
  }),
  sendMessage: () => {
    const socket = get().socket
    const message = get().message
    socket !== null && socket.send(message)
  },
}))

export default useChatStore
