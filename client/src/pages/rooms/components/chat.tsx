import {
  useColyseusRoom,
  useColyseusState
} from "@/colyseus";
import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar.tsx";
import {
  useEffect,
  useRef
} from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RichTextEditor
} from "@/pages/rooms/components/input.tsx";
import { GameMap } from "@/components/game/map.tsx";
import { Renderer } from "@/components/renderer.tsx";

const formatDate = (date: number) => {
  return new Intl.DateTimeFormat(
      "pt-BR",
      {
        hour: "numeric",
        minute: "numeric"
      }
  ).format(new Date(date));
};


export function Chat() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useColyseusState(state => state.messages);
  const room = useColyseusRoom(state => state.room);

  const handleSendMessage = (message: string) => {
    if (!room) {
      return console.error("Room not found");
    }

    if (!message) {
      return console.error("Message is empty");
    }

    if (message.startsWith("/")) {
      room.send(
          "command",
          message
      );
    } else {
      room.send(
          "message",
          message
      );
    }
  };

  useEffect(
      () => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
      },
      [messages]
  );

  return (
      <div className="flex flex-col w-full h-full p-4 gap-2">
        <GameMap />
        <ScrollArea className="md:max-h-[300px] min-h-48 border rounded py-2">
          {messages.map(message => {
            return (
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
                      <Renderer raw={JSON.parse(message.content)} />
                    </div>
                  </div>
                </>
            );
          })}
          <div ref={scrollRef}></div>
        </ScrollArea>
        <form className="flex gap-2 justify-stretch">
          <RichTextEditor handleSubmit={handleSendMessage} />
        </form>
      </div>
  );
}
