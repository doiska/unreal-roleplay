import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { rooms, useColyseusRoom } from "@/colyseus";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export function Rooms() {

    const currentRoom = useColyseusRoom(state => state.room);

    const handleJoinRoom = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const roomId = formData.get("room-id") as string;

        await rooms.joinById(roomId)
    }

    const handleCreateRoom = async () => {
        await rooms.joinOrCreate("rpg-room");
        toast.success("Sala criada com sucesso!");
    }

    if(currentRoom) {
        return <Navigate to={`/room/${currentRoom.id}`} />;
    }

    return (
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
                    <InputOTP
                        maxLength={6}
                        name="room-id"
                        className="uppercase"
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        render={({ slots }) => (
                            <>
                                <InputOTPGroup>
                                    {slots.slice(0, 3).map((slot, index) => (
                                        <InputOTPSlot key={index} {...slot} />
                                    ))}
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    {slots.slice(3).map((slot, index) => (
                                        <InputOTPSlot key={index} {...slot} />
                                    ))}
                                </InputOTPGroup>
                            </>
                        )}
                    />
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
    )
}
