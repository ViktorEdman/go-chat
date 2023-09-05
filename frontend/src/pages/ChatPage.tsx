import { useChatStore } from "../hooks/data";

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
  } = useChatStore();

  return (
    <>
      <div className="h-72 max-h-full my-7  relative overflow-hidden rounded bg-slate-500 w-full max-w-3xl grid-rows-1 grid-cols-4  border border-sky-200 grid">
        <div className="col-span-1 border border-sky-200 overflow-y-auto">Left column</div>
        <div className="col-span-3">
          <div className="h-[90%] flex flex-col overflow-y-auto ">
            {messages.map((message: string) => (
              <span className="w-full ">{message}</span>
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
      <div>{connected ? "Connected" : "Not connected"}</div>
      <div>
        <button
          onClick={() => {
            connected ? disconnect() : connect();
          }}
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
      </div>
      <div>Your username is {userName}</div>
      <div>Message : {message} </div>
      <div>
        <button
          className="rounded bg-blue-400"
          onClick={() => {
            const name = prompt("Select username");
            if (name == null) return;
            setUserName(name);
          }}
        >
          Change username
        </button>
      </div>
    </>
  );
}
