import { create } from "zustand";


interface ChatState {
  messages: string[],
  setUserName: (name: string) => void,
  sendMessage: (message: string) => void,
  userName: string,
  message: string,
  setMessage: (data: string) => void
  receiveMessage: (message: string) => void
  users: string[]
  setUsers: (users: string[]) => void
}

interface SocketState {
  socket: WebSocket | null
  connected: boolean
  setConnected: (connected: boolean) => void
  connect: () => void
  disconnect: () => void
}

type SocketMessage = {
  messageType: "message" | "userList" | "setName",
  userName: string,
  userList?: string[]
  message?: string
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
      const userNameMessage: SocketMessage = { messageType: "setName", userName: state.userName }
      ws.send(JSON.stringify(userNameMessage))
    })
    ws.addEventListener("close", () => {
      state.setUsers([])
      state.setConnected(false)
    })
    ws.addEventListener("message", (event) => {
      const message = event.data.split('\n')
      message.forEach((message: string) => state.receiveMessage(message))
    })

    return { socket: ws }
  }),
  disconnect: () => set((state) => {
    state.socket && state.socket.close()
    return { socket: null, connected: false }
  }),
  userName: localStorage.getItem("username") ?? "",
  setUserName: (name: string) => set((state) => {
    localStorage.setItem("username", name)
    const userNameMessage: SocketMessage = { messageType: "setName", userName: name }
    if (state.socket && state.socket?.readyState === state.socket?.OPEN) {
      state.socket.send(JSON.stringify(userNameMessage))
    }
    return { userName: name }
  }),
  message: "",
  setMessage: (message: string) => set(() => ({ message: message })),
  messages: [],
  receiveMessage: (data: string) => set((state: ChatState) => {
    const message: SocketMessage = JSON.parse(data)
    switch (message.messageType) {
      case "message":
        return { messages: [...state.messages, `${message.userName}: ${message.message}`] }
      case "userList":
        message.userList && state.setUsers(message.userList)
        return { messages: state.messages }
      case "setName":
        state.setUserName(message.userName)
        return { messages: state.messages }
      default:
        return { messages: state.messages }
    }
  }),
  sendMessage: (message: string) => {
    const socket = get().socket
    socket !== null && socket.send(message)
  },
  users: [],
  setUsers: (users: string[]) => set(() => ({ users }))
}))

export default useChatStore
