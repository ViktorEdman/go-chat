import { useState } from "preact/hooks"
import useChatStore from "../hooks/data"

export default function ChatPage() {
  const { messages, sendMessage } = useChatStore()
  const [message, setMessage] = useState("")

  return (
    <div className="h-72 rounded bg-slate-500 w-72 flex flex-col place-content-end border border-sky-200 resize">
      {messages.map(message => <span>{message}</span>)}
      <form className="w-full" onSubmit={(e) => {
        e.preventDefault()
        sendMessage(`You: ${message}`)
        setMessage("")
      }}>
        <input type="text" id="message" className="w-9/12 text-black" value={message} onChange={e => setMessage(e.currentTarget.value)} />
        <button className="w-1/4 rounded bg-green-400 ">Send!</button>
      </form>
    </div>
  )
}
