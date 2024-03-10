import { rooms, useColyseusRoom, useColyseusState } from "./colyseus";
import { useRoomAudio } from "./hooks/use-room-audio.ts";

function App() {
    const messages = useColyseusState((state) => state.messages);
    const room = useColyseusRoom(state => state.room!)

    useRoomAudio();

    const createNewRoom = async () => {
        await rooms.joinOrCreate("rpg-room", {
            username: "Player"
        })

        console.log("Connected to server!")
    }

    const handleConnect = async (room: string) => {
        await rooms.joinById(room, {
            username: "Player"
        })
        console.log("Connected to server!")
    }

    return (
        <>
            {room ? (
                <div>
                    <h1>Room ID: {room.roomId}</h1>
                    <button onClick={rooms.leave}>
                        Leave
                    </button>
                    <div>
                        <h2>Chat</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const data = new FormData(e.target as HTMLFormElement)
                                const message = data.get("message") as string

                                if (message.startsWith('/roll')) {
                                    room.send("command", { command: "roll", content: message.slice(6) })
                                    return;
                                }

                                if(message.startsWith('/play')) {
                                    const url = message.slice(6);
                                    room.send("command", { command: "play", content: url })
                                    return;
                                }

                                room.send("message", message)
                            }}
                        >
                            <input type="text" name="message" />
                            <button>Send</button>
                        </form>
                        <ul>
                            {messages.map((message, i) => (
                                <li key={i}>
                                    <strong>{message.user}</strong>: {message.content}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            const data = new FormData(e.target as HTMLFormElement)
                            handleConnect(data.get("room") as string)
                        }}
                    >
                        <label>
                            Room Name:
                            <input type="text" name="room" />
                        </label>
                        <button>Connect</button>
                    </form>
                    <button onClick={createNewRoom}>Create New Room</button>
                </>
            )}
        </>
    )
}

export default App
