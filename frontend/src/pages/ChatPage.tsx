import { useEffect, useState } from "preact/hooks"
import useChatStore from "../hooks/data"

export default function ChatPage() {
  const { messages, sendMessage, userName, setUserName } = useChatStore()
  const [message, setMessage] = useState("")
  const [connected, setConnected] = useState(false)
  const [socket, setSocket] = useState({} as WebSocket)

  const connect = () => {
    const ws = new WebSocket('wss://' + location.host + "/ws")
    ws.addEventListener("open", () => {
      setConnected(true)
      setSocket(ws)
    })
    ws.addEventListener("close", () => {
      setConnected(false)
      setTimeout(() => connect(), 1000)
    })
    ws.addEventListener("message", (event) => {
      sendMessage(event.data)
    })
  }

  useEffect(() => {
    console.log("Use effect fired")
    connect()
  }, [])
  return (<>
    <div className="h-72 max-h-full my-7  relative overflow-hidden rounded bg-slate-500 w-full max-w-3xl   border border-sky-200 ">
      <div className="flex flex-col overflow-y-auto h-[90%] pb-1">{messages.map((message: string) => <span className="w-full " >{message}</span>)}</div>
      <form className="w-full h-[10%] pt-1" onSubmit={(e) => {
        e.preventDefault()
        socket.send(`${userName ? `${userName}: ${message}` : `Unknown: ${message}`}`)
        setMessage("")
      }}>
        <input autoComplete="off" type="text" id="message" className="w-9/12 text-black" value={message} onChange={e => setMessage(e.currentTarget.value)} />
        <button className="w-1/4 rounded bg-green-400 ">Send!</button>
      </form>

    </div>
    <div>
      {connected ? "Connected" : "Not connected"}
    </div>
    <div>
      Your username is {userName}
    </div>
    <div>
      <button
        className="rounded bg-blue-400"
        onClick={() => {
          const name = prompt("Select username")
          if (name == null) return
          setUserName(name)
        }}
      >Change username</button>
    </div>
  </>)
}
