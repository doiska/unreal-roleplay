import { useColyseusRoom, useColyseusState } from "@/colyseus";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Chat } from "@/pages/rooms/components/chat.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Heart, Rabbit, Shell, Shield, Sparkle, Users2 } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { SongList } from "@/pages/rooms/components/song-list.tsx";

const characterStats = [
    {
        id: 1,
        name: "Força",
        value: 10,
        icon: Shield
    },
    {
        id: 2,
        name: "Destreza",
        value: 10,
        icon: Rabbit
    },
    {
        id: 3,
        name: "Constituição",
        value: 8,
        icon: Heart
    },
    {
        id: 4,
        name: "Inteligência",
        value: 10,
        icon: Shell
    },
    {
        id: 5,
        name: "Sabedoria",
        value: 10,
        icon: Sparkle
    },
    {
        id: 6,
        name: "Carisma",
        value: 10,
        icon: Users2
    }

]

export function Room() {
    const navigate = useNavigate();
    const room = useColyseusRoom(state => state.room)
    const playersMap = useColyseusState(state => state.players);

    if (!room) {
        return <Navigate to="/" />
    }

    const players = [...playersMap.entries()].map(([id, player]) => ({ id, ...player }));

    const handleLeave = async () => {
        await room.leave();
        navigate("/");
    }

    return (
        <div className="relative flex h-full min-w-full">
            <div className="flex flex-col bg-secondary/60 text-white p-4 min-w-72">
                <h1 className="text-2xl font-black">UNREAL ROLEPLAY</h1>
                <h2 className="font-bold">Kimetsu No Yaiba</h2>

                <div className="flex-1 flex flex-col gap-1 my-4">
                    {players.map(player => (
                        <Button variant="outline" key={player.id} className="flex gap-2 justify-start px-2 h-12 ">
                            <Avatar className="w-8 h-8">
                                {/*<AvatarImage src={player.avatar} alt={player.name} />*/}
                                <AvatarFallback>{player.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{player.name}</span>
                        </Button>
                    ))}
                </div>

                <Button
                    className="w-full mt-8"
                    onClick={handleLeave}
                >
                    Sair da sala
                </Button>
            </div>

            <Chat />

            <div className="flex flex-col bg-secondary/60 text-white p-4 min-w-72 space-y-2">
                <Card className="text-2xl font-black p-2 text-center">
                    <CardHeader className="p-0">
                        <CardTitle>
                            doiská
                        </CardTitle>
                        <CardDescription>
                            Nível 1
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="flex flex-col gap-2 p-4">
                    {characterStats.map(stat => (
                        <Badge
                            key={stat.id}
                            variant="secondary-gradient"
                            className="p-1 flex justify-between text-sm pl-2"
                        >
                            <div className="flex gap-2 items-center">
                                <stat.icon size={16} className="text-primary" />
                                <span>{stat.name}</span>
                            </div>
                            <Badge className="w-8 justify-center">{stat.value}</Badge>
                        </Badge>
                    ))}
                </Card>

                <SongList />
            </div>
        </div>
    )
}
