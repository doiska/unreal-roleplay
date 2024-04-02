import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { rooms, useColyseusRoom } from "@/colyseus";
import { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input.tsx";

export function Rooms() {

    const currentRoom = useColyseusRoom(state => state.room);

    const handleJoinRoom = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const roomId = formData.get("room-id") as string;

        await rooms.joinById(roomId, {
            role: "player",
        })
    }

    const handleCreateRoom = async () => {
        await rooms.joinOrCreate("rpg-room", {
            role: "master",
        });

        toast.success("Sala criada com sucesso!");
    }

    if(currentRoom) {
        return <Navigate to={`/room/${currentRoom.id}`} />;
    }

    return (
        <div className="flex flex-col h-full w-full items-center justify-center gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-black">
                        ROOMS
                    </CardTitle>
                    <CardDescription>
                        Crie ou entre em uma sala para jogar
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
                        <Input name="room-id" />
                        <Button className="w-full">
                            Entrar
                        </Button>
                    </form>
                    <Separator />
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={handleCreateRoom}
                    >
                        Criar sala
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
