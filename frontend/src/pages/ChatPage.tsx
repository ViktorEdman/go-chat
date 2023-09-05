import { useChatStore } from "../hooks/data";
import { useEffect } from "preact/hooks";

export default function ChatPage() {
  const {
    disconnect,
    messages,
    sendMessage,
    userName,
    setUserName,
    message,
    setMessage,
    connected,
    connect,
    users
  } = useChatStore();
  useEffect(() => {
    connected === false && connect()
  }, [])
  return (
    <>
      <div className="h-72 max-h-full my-7  relative overflow-hidden rounded bg-slate-500 w-full max-w-3xl grid-rows-1 grid-cols-4  border border-sky-200 grid">
        <div className="col-span-1 border-r overflow-y-auto row-span-2 grid grid-rows-[1fr,8fr,1fr]">
          <h2 className="text-lg row-span-1 px-2 ">Users</h2>
          <ul className="row-span-1 border border-sky-200 px-2 bg-slate-700">
            {users.length > 0 && users.map(user => <li
              className={user === userName ? "font-bold cursor-pointer" : ""}
              onClick={user === userName ? () => {
                const name = prompt("Select username");
                if (name == null) return;
                setUserName(name);
              } : undefined}
            >{user}</li>)}
          </ul>
          <div className="row-span-1 px-2 cursor-pointer"
            onClick={() => {
              connected ? disconnect() : connect();
            }}
          >
            {connected ? "Connected" : "Disconnected"}
          </div>
        </div>

        <div className="col-span-3 row-span-3">
          <div className="h-[90%] flex flex-col overflow-y-auto">
            {messages.map((message: string) => (
              <span className="w-full px-2">{message}</span>
            ))}
          </div>
          <form
            className="w-full h-[10%] pt-1"
            onSubmit={(e) => {
              e.preventDefault();
              let sentMessage = JSON.stringify({
                messageType: "message",
                userName,
                message,
              });
              sendMessage(sentMessage);
              setMessage("");
            }}
          >
            <input
              autoFocus={true}
              autoComplete="off"
              type="text"
              id="message"
              className="w-9/12 text-black"
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
            />
            <button className="w-1/4 rounded bg-green-400 ">Send!</button>
          </form>
        </div>

      </div>
    </>
  );
}
