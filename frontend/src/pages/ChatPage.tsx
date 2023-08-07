import { useEffect, useState } from "preact/hooks"
import useChatStore from "../hooks/data"

export default function ChatPage() {
  const { messages, sendMessage } = useChatStore()
  const [message, setMessage] = useState("")
  const [connected, setConnected] = useState(false)
  const [socket, setSocket] = useState({} as WebSocket)
  useEffect(() => {
    console.log("Use effect fired")
    const ws = new WebSocket('wss://' + location.host + "/ws")
    ws.addEventListener("open", () => {
      setConnected(true)
      setSocket(ws)
    })
    ws.addEventListener("close", () => setConnected(false))
    ws.addEventListener("message", (event) => {
      sendMessage(event.data)
    })
  }, [])
  return (
    <div className="h-72 max-h-full my-7  relative overflow-hidden rounded bg-slate-500 w-full max-w-3xl   border border-sky-200 ">
      <div className="flex flex-col overflow-y-auto h-[80%] pb-1">{messages.map((message: string) => <span className="w-full " >{message}</span>)}</div>
      <form className="w-full h-[10%] pt-1" onSubmit={(e) => {
        e.preventDefault()
        sendMessage(`You: ${message}`)
        socket.send(message)
        setMessage("")
      }}>
        <input type="text" id="message" className="w-9/12 text-black" value={message} onChange={e => setMessage(e.currentTarget.value)} />
        <button className="w-1/4 rounded bg-green-400 ">Send!</button>
      </form>
      <div>{connected ? "Connected" : "Not connected"}</div>
    </div>
  )
}
