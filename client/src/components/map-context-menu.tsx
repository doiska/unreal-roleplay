import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx";
import {
  ReactNode
} from "react";
import {
  InputPrompt,
  usePrompt
} from "@/hooks/use-prompt.tsx";
import {
  useColyseusRoom,
  useMyState
} from "@/colyseus";

export function MapContextMenu({ children }: {
  children: ReactNode
}) {
  const { dialog, open } = usePrompt();
  const room = useColyseusRoom(state => state.room);
  const myState = useMyState();

  return (
      <ContextMenu>
        <ContextMenuTrigger asChild={true}>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {myState?.role === "player" && (
              <>
                <ContextMenuLabel>Player</ContextMenuLabel>
                <ContextMenuItem>
                  Mover token aqui
                </ContextMenuItem>
              </>
          )}

          {myState?.role === "master" && (
              <>
                <ContextMenuLabel>Mapa</ContextMenuLabel>

                <ContextMenuItem
                    inset onClick={() => {
                  open({
                    title: "Alterar fundo",
                    description: "Insira a URL da imagem",
                    placeholder: "https://example.com/image.png"
                  });
                }}
                >
                  Alterar fundo
                </ContextMenuItem>
                <ContextMenuItem inset>
                  Criar Token
                </ContextMenuItem>
              </>
          )}
        </ContextMenuContent>
        <InputPrompt
            dialog={dialog}
            handleSubmit={(e) => {
              console.log(e);
              room?.send("command", `/map set -1 ${e}`);
            }}
        />
      </ContextMenu>
  );
}
