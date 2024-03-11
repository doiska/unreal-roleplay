import { useColyseusRoom, useColyseusState } from "@/colyseus";
import { Input } from "@/components/ui/input.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { type FormEvent } from "react";
import { Button } from "@/components/ui/button.tsx";
import { UploadCloud } from "lucide-react";

const formatDate = (date: number) => {
    return new Intl.DateTimeFormat("pt-BR", {
        hour: "numeric",
        minute: "numeric"
    }).format(new Date(date));
}

export function Chat() {
    const messages = useColyseusState(state => state.messages)
    const room = useColyseusRoom(state => state.room)

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!room) {
            return console.error("Room not found")
        }

        const formData = new FormData(e.currentTarget)
        const message = (formData.get("message") as string).trim();

        if(message.startsWith("/")) {
            room.send("command", message)
        } else {
            room.send("message", message)
        }

        e.currentTarget.reset();
    }

    return (
        <div className="flex flex-col gap-2 w-full h-full py-12">
            <div className="container flex flex-col gap-2 flex-1">
                <div className="flex flex-col flex-1 gap-2">
                    {messages.map(message => (
                        <div
                            key={message.content}
                            className="flex gap-2 hover:bg-secondary/10 p-2 rounded-md transition-all"
                        >
                            <Avatar>
                                <AvatarFallback>{message.user[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-black">
                                    {message.user}
                                    <span className="text-xs font-normal text-gray-500 ml-1">{formatDate(message.createdAt)}</span>
                                </h3>
                                <p>{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input name="message" placeholder="Digite sua mensagem" />
                    <Button variant="default" size="icon">
                        <UploadCloud />
                    </Button>
                </form>
            </div>
        </div>
    )
}
