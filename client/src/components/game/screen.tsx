import { useMyState } from "@/colyseus";
import { GameMap } from "@/components/game/map.tsx";

export function Screen() {
  const myState = useMyState();


  if(!myState?.map) {
    return null;
  }

  return (
      <GameMap image={myState.map} />
  )
}
