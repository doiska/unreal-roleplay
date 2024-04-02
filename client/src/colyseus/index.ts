import { create } from "zustand";
import { RoomAvailable, Client, type Room } from "colyseus.js";
import { RPGRoomState } from "../../../server/src/rooms/schema/rpg-room-state.ts";
import { useEffect, useState } from "react";

function setupColyseus<S extends RPGRoomState>(ws: string) {
    let isConnecting = false;

    const client = new Client(ws);

    const useRoom = create<{
        room: Omit<Room<S>, 'state'> | undefined
    }>(() => ({ room: undefined }));

    const useColyseusState = create<S>()(() => ({} as S));

    const useMyState = () => {
        const sessionId = useRoom(state => state.room?.sessionId);

        if (typeof sessionId === "string") {
            return useColyseusState(curr => curr.players.get(sessionId) || null);
        }

        return null;
    }

    const listenToRoom = (room: Room<S>) => {
        useRoom.setState({ room });
        useColyseusState.setState(state => ({ ...state, ...room.state }));

        room.onStateChange((state) => {
            if (!state) {
                return;
            }

            const newState = state.clone();
            useColyseusState.setState(newState);
        });

        room.onLeave(() => {
            useRoom.setState({ room: undefined });
            useColyseusState.setState({} as S);
        });
    }

    const joinOrCreateRoom = async (roomName: string, options?: {}) => {
        if (isConnecting) {
            return;
        }

        try {
            isConnecting = true;
            const room = await client.joinOrCreate<S>(roomName, options);
            listenToRoom(room);
        } catch (e) {
            console.error(e);
        } finally {
            isConnecting = false;
        }
    }

    const joinById = async (roomId: string, options?: {}) => {
        if (isConnecting) {
            return;
        }

        try {
            isConnecting = true;
            const room = await client.joinById<S>(roomId, options);
            listenToRoom(room);
        } catch (e) {
            console.error(e);
        } finally {
            isConnecting = false;
        }
    }

    const leaveRoom = async () => {
        const currentRoom = useRoom.getState().room;

        if (currentRoom) {
            await currentRoom.leave();
            useRoom.setState({ room: undefined });
            useColyseusState.setState({} as S);
        }
    }

    const useAvailableRooms = () => {
        const [rooms, setRooms] = useState<RoomAvailable[]>([]);

        useEffect(() => {
            const interval = setInterval(async () => {
                const availableRooms = await client.getAvailableRooms();
                setRooms(availableRooms);
            }, 1000);

            return () => clearInterval(interval);
        }, []);

        return rooms;
    }

    return {
        client,
        rooms: {
            getAvailable: client.getAvailableRooms,
            joinById,
            joinOrCreate: joinOrCreateRoom,
            leave: leaveRoom,
        },
        useAvailableRooms,
        useMyState,
        useColyseusRoom: useRoom,
        useColyseusState,
    }
}

export const {
    rooms,
    useColyseusState,
    useColyseusRoom,
    useMyState,
    useAvailableRooms
} = setupColyseus<RPGRoomState>("ws://localhost:2567")
