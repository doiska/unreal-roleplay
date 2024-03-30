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

export function MapContextMenu({ children }: { children: ReactNode } ) {
  return (
      <ContextMenu>
        <ContextMenuTrigger asChild={true}>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuLabel>Mapa</ContextMenuLabel>
          <ContextMenuItem inset>
            Alterar fundo
          </ContextMenuItem>
          <ContextMenuItem inset>
            Criar Token
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
  )
}
