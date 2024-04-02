import { Command } from "@colyseus/command";
import { RPGRoom } from "../rooms/schema/rpg-room-state";

export class OnTokenPositionUpdate extends Command<RPGRoom, {
  sessionId: string,
  targetId: string,
  x: number,
  y: number
}> {
  execute({ sessionId, targetId, x, y } = this.payload) {
    const player = this.state.players.get(sessionId);
    const target = this.state.tokens.get(targetId);

    console.log("Player", player);
    console.log("Token", target);

    if (!player || !target) {
      console.error("Player or Token not found.");
      return;
    }

    if (player.role !== "master" && player.token.id !== targetId) {
      console.error("Player is not allowed to move this token.");
      return;
    }

    target.position.x = x;
    target.position.y = y;
  }
}

