import { create } from "zustand";
import { Client, type Room } from "colyseus.js";
import { Schema } from "@colyseus/schema";
import { RPGRoomState } from "../../../server/src/rooms/schema/rpg-room-state.ts";
import { useEffect } from "react";

function setupColyseus<S extends Schema>(ws: string) {
    let isConnecting = false;

    const client = new Client(ws);

    const useRoom = create<{
        room: Omit<Room<S>, 'state'> | undefined
    }>(() => ({ room: undefined }));

    const useColyseusState = create<S>()(() => ({} as S));

    const useOnBroadcast = (event: string, callback: (message: any) => void) => {
        const room = useRoom.getState().room;

        useEffect(() => {
            if (room) {
                console.log("Listening to broadcast", event)
                room.onMessage(event, callback);
            }
        }, [room, event, callback]);
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

    return {
        client,
        rooms: {
            getAvailable: client.getAvailableRooms,
            joinById,
            joinOrCreate: joinOrCreateRoom,
            leave: leaveRoom,
        },
        useColyseusRoom: useRoom,
        useColyseusState,
        useOnBroadcast
    }
}

export const {
    rooms,
    useColyseusState,
    useColyseusRoom,
    useOnBroadcast
} = setupColyseus<RPGRoomState>("ws://localhost:2567")
