import { useColyseusRoom, useColyseusState } from "@/colyseus";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { type FormEvent, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { UploadCloud } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InputCommand } from "@/pages/rooms/components/input.tsx";
import { TooltipProvider } from "@/components/plate-ui/tooltip.tsx";

const formatDate = (date: number) => {
    return new Intl.DateTimeFormat("pt-BR", {
        hour: "numeric",
        minute: "numeric"
    }).format(new Date(date));
}

export function Chat() {
    const messages = useColyseusState(state => state.messages)
    const room = useColyseusRoom(state => state.room)

    const formRef = useRef<HTMLFormElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log("Sending message")

        if (!room) {
            return console.error("Room not found")
        }

        const formData = new FormData(e.currentTarget)
        const message = (formData.get("message") as string).trim();

        if (message.startsWith("/")) {
            room.send("command", message)
        } else {
            room.send("message", message)
        }

    }

    useEffect(() => {
        if (scrollRef.current) {
            if (scrollRef.current.getBoundingClientRect().top < window.innerHeight) {
                scrollRef.current.scrollIntoView({ behavior: "smooth" })
            }
        }
    }, [messages])

    return (
        <div className="flex flex-col gap-2 w-full h-full py-8 px-4">
            <ScrollArea className="md:max-h-[900px] h-full">
                {messages.map(message => (
                    <>
                        <div
                            key={message.id}
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
                        <div ref={scrollRef}></div>
                    </>
                ))}
            </ScrollArea>
            <form ref={formRef} onSubmit={handleSendMessage} className="flex gap-2">
                <TooltipProvider>
                <InputCommand />
                <Button variant="default" size="icon">
                    <UploadCloud />
                </Button>
                </TooltipProvider>
            </form>
        </div>
    )
}
